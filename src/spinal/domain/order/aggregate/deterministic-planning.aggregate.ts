import { Logger } from '@nestjs/common';
import { addMinutes, subMinutes } from 'date-fns';
import { ArrayHelper } from '../../../../core/shared/helper/array.helper';
import { EnhancedOrders } from '../../../../domain/tasks/aggregate/enhanced-orders';
import {
  DishOrderEnhance,
  OrderEnhanced,
} from '../../../../domain/tasks/models/task-order';
import { dishFinder } from '../../../../zelty/core/dish-finder.utils';
import { DishDTO } from '../../../../zelty/models/dish';
import { OrderDTO } from '../../../../zelty/models/order.dto';

export class DeterministicPlanningAggregate {
  logger = new Logger(DeterministicPlanningAggregate.name);

  eOrdersCreated: OrderEnhanced[];
  eOrdersToCreate: OrderEnhanced[];

  private planning = new Planning();

  constructor(
    orderToCreate: OrderDTO[],
    orderCreated: OrderDTO[],
    dishes: DishDTO[],
  ) {
    const enhancedOrderCreated = new EnhancedOrders(orderCreated, dishes);
    const enhancedOrderToCreate = new EnhancedOrders(orderToCreate, dishes);

    this.eOrdersCreated = enhancedOrderCreated.ordersEnhanced;
    this.eOrdersToCreate = enhancedOrderToCreate.ordersEnhanced;
  }

  public fillPlanningWithCreatedOrders() {
    const groupedOrderCreated = this.groupByDueDate(this.eOrdersCreated);

    let dueDates = Object.keys(groupedOrderCreated);
    dueDates = dueDates.sort();

    for (const date of dueDates) {
      const sameDateOrders: OrderEnhanced[] = groupedOrderCreated[date];
      this.sortOrderByRef(sameDateOrders);
      for (const order of sameDateOrders) {
        const dishes = dishFinder(order) as DishOrderEnhance[];
        const groupedDishes = this.groupByLabel(dishes);
        const labels = Object.keys(groupedDishes);
        for (const label of labels) {
          this.planning.addDishes(label, groupedDishes[label], order.due_date);
        }
      }
    }
  }

  private groupByLabel(dishes: DishOrderEnhance[]) {
    return ArrayHelper.groupBy(dishes, 'preparation', 'label');
  }

  private groupByDueDate(orders: OrderEnhanced[]) {
    return ArrayHelper.groupBy(orders, 'due_date');
  }

  private sortOrderByRef(orders: OrderEnhanced[]) {
    orders.sort((a, b) => a.ref - b.ref);
  }

  toString() {
    return this.planning.toString();
  }
}

class Planning {
  logger = new Logger(Planning.name);
  lines: ProductionLine[] = [];

  constructor() {
    this.lines.push(new ProductionLine(8, 'burger', 5));
    this.lines.push(new ProductionLine(8, 'frites', 4));
    this.lines.push(new ProductionLine(1, 'thai', 4));
    this.lines.push(new ProductionLine(1, 'salade', 4));
    this.lines.push(new ProductionLine(20, 'other', 0));
  }

  addDishes(label: string, dishes: DishOrderEnhance[], dueDate: string) {
    const line = this.findLineByLabel(label);
    if (!line) {
      this.logger.error(`Label: ${label} Dishes ${dishes.map((d) => d.name)} `);
      return;
    }
    const ids = dishes.map((d) => d.id);
    const startDate = line.findAvailableStartHour(dueDate, ids);
    line.addSlot(startDate, ids);
  }

  private findLineByLabel(label: string) {
    return this.lines.find((l) => l.type === label);
  }

  toString() {
    return JSON.stringify(this.lines.map((l) => l.toString()));
  }
}

class ProductionLine {
  slots: Slot[] = [];
  constructor(
    public capacity: number,
    public type: string,
    public timeToPrepare: number,
  ) {}

  findAvailableStartHour(dueDate: string | Date, ids: number[]): Date {
    let startHour = new Date(dueDate) as Date;
    let availableCapacity: number;

    do {
      const overlappingSlots = this.slots.filter((s) => s.isOnDate(startHour));
      availableCapacity = this.countAvailableCapacity(overlappingSlots);
      startHour = subMinutes(startHour, this.timeToPrepare);
    } while (availableCapacity < ids.length);

    return startHour;
  }

  addSlot(startDate: Date, ids: number[]) {
    const endDate = addMinutes(startDate, this.timeToPrepare);
    const newSlot = new Slot(ids, startDate, endDate);
    this.slots.push(newSlot);
  }

  private countAvailableCapacity(slots: Slot[]): number {
    const capacityUsed = slots.reduce((acc, v) => (acc += v.countDish), 0);
    return this.capacity - capacityUsed;
  }

  toString() {
    return this.slots;
  }
}

class Slot {
  constructor(
    private ids: number[],
    private startDate: Date,
    private endDate: Date,
  ) {}

  get countDish(): number {
    return this.ids.length;
  }

  get startTime(): number {
    return this.startDate.getTime();
  }

  get endTime(): number {
    return this.endDate.getTime();
  }

  isOnDate(dueDate: Date) {
    const time = dueDate.getTime();
    return this.startTime <= time && this.endTime > time;
  }
}
