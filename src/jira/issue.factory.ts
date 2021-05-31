import {
  findJiraComponent,
  selectPriority,
} from 'src/coordination/order-priority/order-priority.util';
import { getPreparationInformationsByDish } from '../coordination/order-timing/order-timing.utils';
import { dishFinder } from '../zelty/core/dish-finder.utils';
import { DishDTO } from '../zelty/models/dish';
import { DishOrder, OrderDTO } from '../zelty/models/order.dto';
import { CreatePriority } from './models/jira-issue-created.dto';
import { JiraSubTask } from './models/jira-sub-task.model';
import { JiraTask } from './models/jira-task.model';
export class IssueFactory {
  private task: JiraTask;
  private subTasks: JiraSubTask[] = [];

  constructor(
    public readonly order: OrderDTO,
    public readonly fullDishes: DishDTO[],
  ) {
    this.task = new JiraTask(order);
    const dishes = dishFinder(order);
    const groupedDishes = this.groupDishesByTags(dishes);
    const aggregateComponents = new Set<string>();
    Array.from(groupedDishes.keys()).forEach((k) => {
      const typedDishes = groupedDishes.get(k);
      this.subTasks.push(
        ...typedDishes.map((d, index) => {
          const priority = this.findPriorityByTags(d);
          const component = this.findJiraComponentByTags(d);
          aggregateComponents.add(component.id);
          const preparation = getPreparationInformationsByDish(k);
          return new JiraSubTask(
            d,
            order,
            index,
            priority,
            preparation,
            component,
          );
        }),
      );

      const components = Array.from(aggregateComponents.values()).map((id) => ({
        id,
      }));

      this.task.fields.components = components;
    });
  }

  public addParentId(parentId: string): void {
    this.subTasks.forEach(
      (sub: JiraSubTask) => (sub.fields.parent = { id: parentId }),
    );
  }

  public getTask(): JiraTask {
    return this.task;
  }

  public getSubTasks(): JiraSubTask[] {
    return this.subTasks;
  }

  private groupDishesByTags(dishes: DishOrder[]): Map<number, DishOrder[]> {
    const result = new Map<number, DishOrder[]>();

    for (const dish of dishes) {
      const id = this.findFullDish(dish)?.tags[0] ?? -1;
      const matchingArray = result.get(id) ?? [];
      matchingArray.push(dish);
    }
    return result;
  }

  private findFullDish(dish: DishOrder): DishDTO {
    return this.fullDishes.find((d) => d.id === dish.item_id);
  }

  private findPriorityByTags(dishOrder: DishOrder): CreatePriority | undefined {
    const dish = this.findFullDish(dishOrder);
    if (!dish) {
      return;
    }

    return selectPriority(dish);
  }

  private findJiraComponentByTags(
    dishOrder: DishOrder,
  ): CreatePriority | undefined {
    const dish = this.findFullDish(dishOrder);
    if (!dish) {
      return;
    }

    return findJiraComponent(dish);
  }
}
