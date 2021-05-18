import { Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DishSpinalDomainService } from '../../spinal/domain/dish-spinal/dish-spinal-domain.service';
import { OrderSpinalDomainService } from '../../spinal/domain/order/order-spinal-domain.service';
import { dishFinder } from '../../zelty/core/dish-finder.utils';
import { DishDTO } from '../../zelty/models/dish';
import { DishOrder, OrderDTO } from '../../zelty/models/order';

interface MixedDished {
  fullDishes: DishDTO[];
  orderedDishes: DishOrder[];
}

@Injectable()
export class MatrixReportingService {
  constructor(
    private readonly dishDomainService: DishSpinalDomainService,
    private readonly orderDomainService: OrderSpinalDomainService,
  ) {}

  generateMatrix() {
    const dishes$ = this.dishDomainService.findAll();
    const orders$ = this.orderDomainService.findAll();

    return forkJoin([dishes$, orders$]).pipe(
      map(([fullDishes, orders]) => {
        const orderedDishes = this.findDishes(orders);
        return { orderedDishes, fullDishes };
      }),
      map((mixedDishes) => this.generateReport(mixedDishes)),
    );
  }

  private findDishes(orders: OrderDTO[]) {
    const dishes: DishOrder[] = [];
    for (const order of orders) {
      const dishesOrder = dishFinder(order);
      dishes.push(...dishesOrder);
    }
    return dishes;
  }

  private generateReport({
    fullDishes,
    orderedDishes,
  }: MixedDished): number[][] {
    const report = new Map<number, { count: number; marge: number }>();
    for (const dish of orderedDishes) {
      const id = (dish as any).item_id;
      const count = (report.get(id)?.count ?? 0) + 1;
      try {
        const dish = fullDishes.find((d) => d.id === id);
        const marge = this.calculMargeBrute(dish);
        if (Number.isFinite(marge)) {
          report.set(id, { count, marge });
        }
      } catch (error) {
        // console.log(dish);
      }
    }
    const data = Array.from(report.values()).map((v) => [v.count, v.marge]);

    const countDishes = orderedDishes.length;
    // TODO remove cheating * 10
    data.forEach((d) => (d[0] = (d[0] / countDishes) * 100 * 10));

    return data;
  }

  private calculMargeBrute(dish: DishDTO) {
    const price = dish.price;
    const coast: number =
      dish.quantities?.reduce(
        (sum, q) => sum + (q.amount / 1000) * q.ingredient.price,
        0,
      ) ?? 0;
    // FIXME deal with infinity
    return price / (coast * 100);
  }
}
