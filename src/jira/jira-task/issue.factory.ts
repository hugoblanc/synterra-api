import { Logger } from '@nestjs/common';
import { addDays } from 'date-fns';
import {
  DishOrderEnhance,
  OrderEnhanced,
} from '../../domain/tasks/models/task-order';
import { DeterministicPlanningAggregate } from '../../spinal/domain/order/aggregate/deterministic-planning.aggregate';
import { dishFinder } from '../../zelty/core/dish-finder.utils';
import { JiraSubTask } from '../models/jira-sub-task.model';
import { JiraTask } from '../models/jira-task.model';

export class IssueFactory {
  private logger = new Logger(IssueFactory.name);
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
    public readonly order: OrderEnhanced,
    private readonly planning: DeterministicPlanningAggregate,
  ) {
    this._task = new JiraTask(order);
    this._subTasks = this.createSubTasks();

    const { components, maxPreparationStartDate } =
      this.extractMissingTaskInformationsFromSubtasks();

    this._task.addMissingInformations(maxPreparationStartDate, components);
  }

  public addParentId(parentId: string): void {
    this._subTasks.forEach(
      (sub: JiraSubTask) => (sub.fields.parent = { id: parentId }),
    );
  }

  private createSubTasks(): JiraSubTask[] {
    const dishes = dishFinder(this.order) as DishOrderEnhance[];
    const subTasks = [];
    for (const dish of dishes) {
      const slot = this.planning.findSlotByDishId(dish.id);
      const subTask = new JiraSubTask(dish, this.order, slot);

      subTasks.push(subTask);
    }

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
}
