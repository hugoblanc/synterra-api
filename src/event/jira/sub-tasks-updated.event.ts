import { SubTaskUpdateDTO } from '../../jira/models/sub-task-update.model';

export class SubTasksUpdatedEvent {
  public static readonly EVENT_NAME = 'sub-tasks.updated';
  constructor(public readonly subTaskUpdates: SubTaskUpdateDTO[]) {}
}
