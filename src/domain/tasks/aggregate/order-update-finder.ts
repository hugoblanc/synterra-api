import { isEqual } from 'date-fns';
import { SubTaskUpdateDTO } from '../../../jira/models/sub-task-update.model';
import { DeterministicPlanningAggregate } from '../../../spinal/domain/order/aggregate/deterministic-planning.aggregate';
import { dishFinder } from '../../../zelty/core/dish-finder.utils';
import { DishOrderEnhance, OrderEnhanced } from '../models/task-order';

export class OrderUpdateFinder {
  updates: SubTaskUpdateDTO[] = [];

  constructor(
    public orders: OrderEnhanced[],
    public planning: DeterministicPlanningAggregate,
  ) {}
  findUpdates() {
    if (this.orders.length === 0) {
      return [];
    }

    for (const order of this.orders) {
      const dishes = dishFinder(order) as DishOrderEnhance[];
      for (const dish of dishes) {
        const slot = this.planning.findSlotByDishId(dish.id);

        if (!isEqual(slot.startDate, new Date(dish.maxPreparationTime))) {
          this.updates.push({
            id: (dish as any).jiraIssueId,
            fields: { customfield_10031: slot.startDate.toISOString() },
          });
        }
      }
    }

    console.log(this.updates);

    return this.updates;
  }
}
