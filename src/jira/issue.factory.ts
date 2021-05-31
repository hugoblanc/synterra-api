import { selectPriority } from 'src/coordination/order-priority/order-priority.util';
import { dishFinder } from '../zelty/core/dish-finder.utils';
import { DishDTO } from '../zelty/models/dish';
import { DishOrder, OrderDTO } from '../zelty/models/order.dto';
import { CreatePriority } from './models/jira-issue-created.dto';
import { JiraSubTask } from './models/jira-sub-task.model';
import { JiraTask } from './models/jira-task.model';
export class IssueFactory {
  private task: JiraTask;
  private subTasks: JiraSubTask[];

  constructor(
    public readonly order: OrderDTO,
    public readonly fullDishes: DishDTO[],
  ) {
    this.task = new JiraTask(order);
    const dishes = dishFinder(order);

    this.subTasks = dishes.map((d) => {
      const priority = this.findPriorityByTags(d);
      return new JiraSubTask(d, order, priority);
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
  private findPriorityByTags(dishDto: DishOrder): CreatePriority | undefined {
    const dish = this.fullDishes.find((d) => d.id === dishDto.item_id);

    if (!dish) {
      return;
    }

    return selectPriority(dish);
  }
}
