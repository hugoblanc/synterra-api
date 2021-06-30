import { Logger } from '@nestjs/common';
import { addDays } from 'date-fns';
import {
  findJiraComponent,
  selectPriority,
} from '../../coordination/order-priority/order-priority.util';
import {
  DishPreparationInformation,
  getPreparationInformationsByDish,
} from '../../coordination/order-timing/order-timing.utils';
import { dishFinder } from '../../zelty/core/dish-finder.utils';
import { DishDTO } from '../../zelty/models/dish';
import { DishOrder, OrderDTO } from '../../zelty/models/order.dto';
import { CreatePriority } from '../models/jira-issue-created.dto';
import { JiraSubTask } from '../models/jira-sub-task.model';
import { JiraTask } from '../models/jira-task.model';
export class IssueFactory {
  logger = new Logger(IssueFactory.name);
  private _task: JiraTask;
  private _subTasks: JiraSubTask[] = [];
  private componentIdList = new Set<string>();
  public get task(): JiraTask {
    return this._task;
  }

  public get subTasks(): JiraSubTask[] {
    return this._subTasks;
  }

  constructor(
    private readonly order: OrderDTO,
    private readonly fullDishes: DishDTO[],
  ) {
    this._task = new JiraTask(order);
    this._subTasks = this.createSubTasks();

    const {
      components,
      maxPreparationStartDate,
    } = this.extractMissingTaskInformationsFromSubtasks();

    this._task.addMissingInformations(maxPreparationStartDate, components);
  }

  public addParentId(parentId: string): void {
    this._subTasks.forEach(
      (sub: JiraSubTask) => (sub.fields.parent = { id: parentId }),
    );
  }

  private createSubTasks(): JiraSubTask[] {
    const dishes = dishFinder(this.order);
    const groupedDishes = this.groupDishesByTags(dishes);
    const subTasks = this.convertGroupedDishesIntoSubTasks(groupedDishes);
    return subTasks;
  }

  private extractMissingTaskInformationsFromSubtasks(): {
    components: { id: string }[];
    maxPreparationStartDate: string;
  } {
    const components = Array.from(this.componentIdList.values()).map((id) => ({
      id,
    }));

    let maxPreparationStartDate: string = addDays(new Date(), 2).toISOString();
    for (const subTask of this._subTasks) {
      if (subTask.fields.customfield_10031 < maxPreparationStartDate) {
        maxPreparationStartDate = subTask.fields.customfield_10031;
      }
    }

    return { components, maxPreparationStartDate };
  }

  private convertGroupedDishesIntoSubTasks(
    groupedDishes: Map<number, DishOrder[]>,
  ): JiraSubTask[] {
    const subTasks: JiraSubTask[] = [];
    Array.from(groupedDishes.keys()).forEach((key) => {
      const typedDishes = groupedDishes.get(key);
      subTasks.push(
        ...typedDishes.map((d, index) => {
          const { priority, component, preparation } = this.findSubTaskDetails(
            d,
            key,
          );
          return new JiraSubTask(
            d,
            this.order,
            index,
            priority,
            preparation,
            component,
          );
        }),
      );
    });

    return subTasks;
  }

  private findSubTaskDetails(
    dish: DishOrder,
    tagId: number,
  ): {
    priority: CreatePriority;
    component: CreatePriority;
    preparation: DishPreparationInformation;
  } {
    const priority = this.findPriorityByTags(dish);
    const component = this.findJiraComponentByTags(dish);
    if (component) {
      this.componentIdList.add(component?.id);
    } else {
      this.logger.error(
        'Pas de composant pour ' +
          dish.name +
          '  id:' +
          dish.id +
          ' item id ' +
          dish.item_id,
      );
      this.logger.error(JSON.stringify(dish));
    }
    const preparation = getPreparationInformationsByDish(tagId);
    if (!preparation) {
      this.logger.error(
        'Pas de préparation pour le tag ' + JSON.stringify(tagId),
      );
    }

    return { priority, component, preparation };
  }

  private groupDishesByTags(dishes: DishOrder[]): Map<number, DishOrder[]> {
    const result = new Map<number, DishOrder[]>();

    for (const dish of dishes) {
      const id = this.findFullDish(dish)?.tags[0] ?? -1;
      const matchingArray = result.get(id) ?? [];
      matchingArray.push(dish);
      result.set(id, matchingArray);
    }
    return result;
  }

  private findFullDish(dish: DishOrder): DishDTO {
    const fullDish = this.fullDishes.find(
      (d) => d.id === (dish.item_id ?? dish.id),
    );
    if (!fullDish) {
      this.logger.warn('Full dish not found');
      this.logger.warn(JSON.stringify(fullDish));
    }
    return fullDish;
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
