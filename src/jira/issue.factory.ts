import { dishFinder } from '../zelty/core/dish-finder.utils';
import { OrderDTO } from '../zelty/models/order';
import { JiraSubTask } from './models/jira-sub-task.model';
import { JiraTask } from './models/jira-task.model';
export class IssueFactory {
  private task: JiraTask;
  private subTasks: JiraSubTask[];

  constructor(public readonly order: OrderDTO) {
    this.task = new JiraTask(order.ref);
    const dishes = dishFinder(order);
    this.subTasks = dishes.map((d) => new JiraSubTask(d.name));
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
}
