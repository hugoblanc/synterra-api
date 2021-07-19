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

  public fillPlanning() {
    this.fillPlanningOrders(this.eOrdersCreated);
    this.fillPlanningOrders(this.eOrdersToCreate);
  }

  public findSlotByDishId(dishId: number) {
    return this.planning.findSlotByDishId(dishId);
  }

  private fillPlanningOrders(orders: OrderEnhanced[]) {
    const groupedOrders = this.groupByDueDate(orders);

    let dueDates = Object.keys(groupedOrders);
    dueDates = dueDates.sort();

    for (const date of dueDates) {
      const sameDateOrders: OrderEnhanced[] = groupedOrders[date];
      this.sortOrderByRef(sameDateOrders);
      for (const order of sameDateOrders) {
        const dishes = dishFinder(order) as DishOrderEnhance[];
        const groupedDishes = this.groupByLabel(dishes);
        const labels = Object.keys(groupedDishes);
        for (const label of labels) {
          this.planning.addDishes(
            label,
            groupedDishes[label],
            order.maxDeliveryDate,
          );
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
    this.lines.push(new ProductionLine(30, 'other', 0));
  }

  addDishes(label: string, dishes: DishOrderEnhance[], deliveryDate: Date) {
    const line = this.findLineByLabel(label);
    if (!line) {
      this.logger.error(`Label: ${label} Dishes ${dishes.map((d) => d.name)} `);
      return;
    }
    const ids = dishes.map((d) => d.id);
    line.attributeSlots(deliveryDate, ids);
  }

  findSlotByDishId(dishId: number): Slot | undefined {
    for (const line of this.lines) {
      const slot = line.findSlotByDishId(dishId);
      if (slot) {
        return slot;
      }
    }
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

  attributeSlots(startDate: Date, ids: number[]): void {
    while (ids.length > 0) {
      const findingResult = this.findAvailableStartHour(startDate, ids);
      this.createSlot(findingResult.startDate, findingResult.ids);
      ids = findingResult.leftToFindIds;
    }
  }

  findAvailableStartHour(dueDate: Date, ids: number[]): FindingSlotResult {
    if (ids.length > this.capacity) {
      return this.findAvailableSequential(dueDate, ids);
    }
    return this.findAvailableParallel(dueDate, ids);
  }

  findSlotByDishId(dishId: number): Slot | undefined {
    return this.slots.find((s) => s.includes(dishId));
  }

  private createSlot(startDate: Date, ids: number[]) {
    const endDate = addMinutes(startDate, this.timeToPrepare);
    const newSlot = new Slot(ids, startDate, endDate);
    this.slots.push(newSlot);
  }

  private findAvailableParallel(
    startDate: Date,
    ids: number[],
  ): FindingSlotResult {
    let availableCapacity: number;
    let endDate = startDate;
    startDate = subMinutes(startDate, this.timeToPrepare);
    do {
      const overlappingSlots = this.slots.filter((s) =>
        s.isOnDate(startDate, endDate),
      );
      availableCapacity = this.countAvailableCapacity(overlappingSlots);

      if (availableCapacity >= ids.length) break;
      endDate = subMinutes(endDate, 1);
      startDate = subMinutes(startDate, 1);
    } while (availableCapacity < ids.length);

    return { ids, startDate, leftToFindIds: [] };
  }

  private findAvailableSequential(
    startDate: Date,
    ids: number[],
  ): FindingSlotResult {
    let availableCapacity: number;
    let endDate = startDate;
    startDate = subMinutes(startDate, this.timeToPrepare);
    do {
      const overlappingSlots = this.slots.filter((s) =>
        s.isOnDate(startDate, endDate),
      );
      availableCapacity = this.countAvailableCapacity(overlappingSlots);

      if (availableCapacity > 0) break;
      endDate = subMinutes(endDate, 1);
      startDate = subMinutes(startDate, 1);
    } while (availableCapacity === 0);

    const dishSelectedIds = ids.slice(0, availableCapacity);
    const leftToFindIds = ids.slice(availableCapacity);
    return { ids: dishSelectedIds, startDate, leftToFindIds };
  }

  private countAvailableCapacity(slots: Slot[]): number {
    const capacityUsed = slots.reduce((acc, v) => (acc += v.countDish), 0);
    return this.capacity - capacityUsed;
  }

  toString() {
    return this.slots;
  }
}

export class Slot {
  constructor(
    private ids: number[],
    public startDate: Date,
    private endDate: Date,
  ) {}

  get countDish(): number {
    return this.ids.length;
  }

  includes(id: number): boolean {
    return this.ids.includes(id);
  }

  isOnDate(startDate: Date, endDate: Date) {
    return (
      (startDate <= this.startDate && endDate > this.startDate) ||
      (startDate < this.endDate && endDate >= this.endDate)
    );
  }
}

interface FindingSlotResult {
  ids: number[];
  startDate: Date;
  leftToFindIds: number[];
}
