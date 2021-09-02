import { Logger } from '@nestjs/common';
import { findJiraComponent } from '../../../../coordination/order-priority/order-priority.util';
import {
  EnhancedOrders,
  FullDishFinder,
} from '../../../../domain/tasks/aggregate/enhanced-orders';
import { OrderEnhanced } from '../../../../domain/tasks/models/task-order';
import { dishFinder } from '../../../../zelty/core/dish-finder.utils';
import { DishDTO } from '../../../../zelty/models/dish';
import { DishOrder, OrderDTO } from '../../../../zelty/models/order.dto';

export class RealtimePlanningAggregate {
  private logger = new Logger(RealtimePlanningAggregate.name);
  private fullDishesFinder: FullDishFinder;

  eOrders: OrderEnhanced[];
  constructor(orders: OrderDTO[], dishes: DishDTO[]) {
    this.fullDishesFinder = new FullDishFinder(dishes);
    this.eOrders = new EnhancedOrders(orders, dishes).ordersEnhanced;

    const planning = new Planning();

    const extracted = orders.map((o) => ({
      order: o,
      dishesOrder: dishFinder(o),
    }));
    extracted.forEach((e) => {
      e.dishesOrder.forEach((d) => {
        const fullDish = this.fullDishesFinder.findFullDish(d);
        const component = findJiraComponent(fullDish);
        planning.addDish(d, component.id);
      });
    });
  }

  // recalibrate(avg: AvgTiming) {}
}

class Planning {
  lines: ProductionLine[] = [];
  addDish(disheOrder: DishOrder, componentId: string) {
    let line = this.findLineByComponentId(componentId);
    if (!line) {
      line = new ProductionLine(componentId);
      this.lines.push(line);
    }
    line.addDish(disheOrder);
  }

  private findLineByComponentId(componentId: string) {
    return this.lines.find((l) => l.componentId === componentId);
  }
}

class ProductionLine {
  slots;
  constructor(public componentId: string) {}

  addDish(disheOrder: DishOrder) {
    // const newSlot = new Slot(
    //   disheOrder,
    //   disheOrder.maxPreparationTime,
    //   disheOrder.maxDeliveryDate,
    // );
    // this.slots.push(newSlot);
  }
}

class Slot {
  constructor(
    public dishOrder: DishOrder,
    public startTime: Date,
    public endTime: Date,
  ) {}
}
