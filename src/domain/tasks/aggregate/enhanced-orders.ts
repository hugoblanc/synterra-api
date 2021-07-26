import { Logger } from '@nestjs/common';
import {
  findJiraComponent,
  selectPriority,
} from '../../../coordination/order-priority/order-priority.util';
import {
  calculateMaxDeliveryTime,
  findPreparationTime,
} from '../../../coordination/order-timing/order-timing.utils';
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
  }

  private enhanceDishes(order: OrderDTO) {
    const dishOrders = dishFinder(order);
    (order as OrderEnhanced).maxDeliveryDate = calculateMaxDeliveryTime(
      order.due_date,
      order.delivery_address?.city,
    );
    for (const dish of dishOrders) {
      const fullDish = this.findFullDish(dish);

      const priority = selectPriority(fullDish);
      const component = findJiraComponent(fullDish);
      const preparation = findPreparationTime(fullDish);

      if (preparation == null) {
        this.logger.error(`Missing preparation for dish ${fullDish.name}`);
      }

      if (component == null) {
        this.logger.error(`Missing component for dish ${fullDish.name}`);
      }

      if (priority == null) {
        this.logger.error(`Missing priority for dish ${fullDish.name}`);
      }

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
}
