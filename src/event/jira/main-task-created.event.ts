import { IssueFactory } from '../../jira/jira-task/issue.factory';

export class MainTaskCreatedEvent {
  public static readonly EVENT_NAME = 'main-task.created';
  constructor(
    public readonly taskId: string,
    public readonly factory: IssueFactory,
  ) {}
}
