import { Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DishSpinalDomainService } from '../spinal/domain/dish-spinal/dish-spinal-domain.service';
import { OrderDomainService } from '../spinal/domain/order/order-domain.service';
import { DishDTO } from '../zelty/models/dish';
import { DishOrder, OrderDTO } from '../zelty/models/order';

interface MixedDished {
  fullDishes: DishDTO[];
  orderedDishes: DishOrder[];
}

@Injectable()
export class ReportingService {
  constructor(
    private readonly dishDomainService: DishSpinalDomainService,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  generateMatrix() {
    const dishes$ = this.dishDomainService.findAll();
    const orders$ = this.orderDomainService.findAll();

    return forkJoin([dishes$, orders$]).pipe(
      map(([fullDishes, orders]) => {
        const orderedDishes = this.dishFinder(orders);
        return { orderedDishes, fullDishes };
      }),
      map((mixedDishes) => this.generateReport(mixedDishes)),
    );
  }

  private dishFinder(orders: OrderDTO[]) {
    const dishes: DishOrder[] = [];
    for (const order of orders) {
      for (const menu of order.contents) {
        dishes.push(...menu.contents);
      }
    }
    return dishes;
  }

  private generateReport({
    fullDishes,
    orderedDishes,
  }: MixedDished): number[][] {
    const report = new Map<number, { count: number; marge: number }>();
    for (const dish of orderedDishes) {
      const id = dish.id;
      const count = (report.get(id)?.count ?? 0) + 1;
      try {
        const dish = fullDishes.find((d) => d.id === id);
        const marge = this.calculMargeBrute(dish);
        report.set(id, { count, marge });
      } catch (error) {
        // console.log(dish);
      }
    }
    const data = Array.from(report.values()).map((v) => [v.count, v.marge]);

    let takes = 0;
    for (const dish of data) {
      takes += dish[0];
    }

    data.forEach((d) => (d[0] = (d[0] / takes) * 100));

    return data;
  }

  calculMargeBrute(dish: DishDTO) {
    const price = dish.price;
    const coast: number =
      dish.quantities?.reduce(
        (sum, q) => sum + q.amount * q.ingredient.price,
        0,
      ) ?? 0;
    return price / coast;
  }
}
