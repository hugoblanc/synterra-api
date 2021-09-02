import { Logger } from '@nestjs/common';
import {
  findJiraComponent,
  selectPriority,
} from '../../../coordination/order-priority/order-priority.util';
import { calculateMaxDeliveryTime } from '../../../coordination/order-timing/order-timing.utils';
import { dishFinder } from '../../../zelty/core/dish-finder.utils';
import { DishDTO } from '../../../zelty/models/dish';
import { DishOrder, OrderDTO } from '../../../zelty/models/order.dto';
import { OrderEnhanced } from '../models/task-order';

export class EnhancedOrders {
  public ordersEnhanced: OrderEnhanced[] = [];

  private fullDishesFinder: FullDishFinder;
  private logger = new Logger(EnhancedOrders.name);

  constructor(orders: OrderDTO[], dishes: DishDTO[]) {
    this.fullDishesFinder = new FullDishFinder(dishes);
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
      const fullDish = this.fullDishesFinder.findFullDish(dish);

      const priority = selectPriority(fullDish);
      const component = findJiraComponent(fullDish);

      if (component == null) {
        this.logger.error(`Missing component for dish ${fullDish.name}`);
      }

      if (priority == null) {
        this.logger.error(`Missing priority for dish ${fullDish.name}`);
      }

      Object.assign(dish, { component, priority });
    }
  }
}

export class FullDishFinder {
  private logger = new Logger(FullDishFinder.name);

  constructor(private readonly dishes: DishDTO[]) {}
  public findFullDish(dish: DishOrder): DishDTO {
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
