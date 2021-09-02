import { Logger } from '@nestjs/common';
import { addMilliseconds, subMilliseconds, subMinutes } from 'date-fns';
import {
  findCapacityByComponentId,
  findPreparationTimeByComponentId,
  findTimePreparationTime,
} from '../../../../coordination/jira-utils';
import { ArrayHelper } from '../../../../core/shared/helper/array.helper';
import { AvgTimingDTO } from '../../../../domain/analytics/model/avg-timing';
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

  private planning: Planning;

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

  public fillPlanning(avgTiming: AvgTimingDTO) {
    this.planning = new Planning(avgTiming);
    this.fillPlanningOrders(this.eOrdersCreated);
    this.fillPlanningOrders(this.eOrdersToCreate);
  }

  public findSlotByDishId(dishId: number) {
    return this.planning.findSlotByDishId(dishId);
  }

  private fillPlanningOrders(orders: OrderEnhanced[]) {
    const groupedOrders = this.groupByDueDate(orders);

    const dueDates = Object.keys(groupedOrders);

    for (const date of dueDates) {
      const sameDateOrders: OrderEnhanced[] = groupedOrders[date];
      for (const order of sameDateOrders) {
        const dishes = dishFinder(order) as DishOrderEnhance[];
        const groupedDishes = this.groupByComponentId(dishes);
        const componentIds = Object.keys(groupedDishes);
        for (const componentId of componentIds) {
          this.planning.addDishes(
            componentId,
            groupedDishes[componentId],
            order.maxDeliveryDate,
          );
        }
      }
    }
  }

  private groupByComponentId(dishes: DishOrderEnhance[]) {
    return ArrayHelper.groupBy(dishes, 'component', 'id');
  }

  private groupByDueDate(orders: OrderEnhanced[]) {
    return ArrayHelper.groupBy(orders, 'due_date');
  }

  toString() {
    return this.planning.toString();
  }
}

class Planning {
  logger = new Logger(Planning.name);
  lines: ProductionLine[] = [];

  constructor(avgTiming: AvgTimingDTO) {
    Object.keys(avgTiming).forEach((componentId) => {
      const column = avgTiming[componentId];
      const avgTime = findTimePreparationTime(column);
      const capacity = findCapacityByComponentId(componentId);
      if (!capacity) {
        return;
      }
      this.lines.push(new ProductionLine(capacity, componentId, avgTime));
    });
  }

  addDishes(
    componentId: string,
    dishes: DishOrderEnhance[],
    deliveryDate: Date,
  ) {
    let line = this.findLineByComponentId(componentId);
    if (!line) {
      this.logger.warn(
        `Component ID: ${componentId} Dishes ${dishes.map((d) => d.name)} `,
      );
      line = this.createLineIfDataWasMissing(componentId);
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

  private findLineByComponentId(componentId: string) {
    return this.lines.find((l) => l.type === componentId);
  }

  private createLineIfDataWasMissing(componentId: string) {
    const capacity = findCapacityByComponentId(componentId);
    const preparationTime = findPreparationTimeByComponentId(componentId);
    const line = new ProductionLine(capacity, componentId, preparationTime);
    this.lines.push(line);
    return line;
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
    public timeToPrepareMs: number,
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
    const endDate = addMilliseconds(startDate, this.timeToPrepareMs);
    const newSlot = new Slot(ids, startDate, endDate);
    this.slots.push(newSlot);
  }

  private findAvailableParallel(
    startDate: Date,
    ids: number[],
  ): FindingSlotResult {
    let availableCapacity: number;
    let endDate = startDate;
    startDate = subMilliseconds(startDate, this.timeToPrepareMs);
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
    startDate = subMilliseconds(startDate, this.timeToPrepareMs);
    do {
      const overlappingSlots = this.slots.filter((s) =>
        s.isOnDate(startDate, endDate),
      );
      availableCapacity = this.countAvailableCapacity(overlappingSlots);

      if (availableCapacity > 0) break;
      endDate = subMinutes(endDate, 1);
      startDate = subMinutes(startDate, 1);
    } while (availableCapacity <= 0);

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
      Math.max(startDate.getTime(), this.startDate.getTime()) <
      Math.min(endDate.getTime(), this.endDate.getTime())
    );
  }
}

interface FindingSlotResult {
  ids: number[];
  startDate: Date;
  leftToFindIds: number[];
}
