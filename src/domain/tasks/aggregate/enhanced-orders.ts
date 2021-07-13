import { Logger } from '@nestjs/common';
import {
  findJiraComponent,
  selectPriority,
} from '../../../coordination/order-priority/order-priority.util';
import { findPreparationTime } from '../../../coordination/order-timing/order-timing.utils';
import { dishFinder } from '../../../zelty/core/dish-finder.utils';
import { DishDTO } from '../../../zelty/models/dish';
import { DishOrder, OrderDTO } from '../../../zelty/models/order.dto';
import { OrderEnhanced } from '../models/task-order';

export class EnhancedOrders {
  public ordersEnhanced: OrderEnhanced[] = [];

  private logger = new Logger(EnhancedOrders.name);

  constructor(orders: OrderDTO[], private readonly dishes: DishDTO[]) {
    for (const order of orders) {
      this.enhanceDishes(order);
    }

    this.ordersEnhanced = orders as OrderEnhanced[];

    this.sortOrderByDate();
  }

  private enhanceDishes(order: OrderDTO) {
    const dishOrders = dishFinder(order);
    for (const dish of dishOrders) {
      const fullDish = this.findFullDish(dish);

      const priority = selectPriority(fullDish);
      const component = findJiraComponent(fullDish);
      const preparation = findPreparationTime(fullDish);

      Object.assign(dish, { preparation, component, priority });
    }
  }

  private findFullDish(dish: DishOrder): DishDTO {
    const fullDish = this.dishes.find(
      (d) => d.id === (dish.item_id ?? dish.id),
    );
    if (!fullDish) {
      this.logger.warn('Full dish not found');
      this.logger.warn(JSON.stringify(fullDish));
    }
    return fullDish;
  }

  private sortOrderByDate(): void {
    this.ordersEnhanced.sort((a, b) => {
      if (a.due_date < b.due_date) return -1;
      if (a.due_date > b.due_date) return 1;
      return 0;
    });
  }
}
