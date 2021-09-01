import { IssueFactory } from '../../jira/jira-task/issue.factory';
import { IssueCreatedDto } from '../../jira/models/jira-issue-created.dto';

export class SubTasksCreatedEvent {
  public static readonly EVENT_NAME = 'sub-tasks.created';
  constructor(
    public readonly issuesCreated: IssueCreatedDto[],
    public readonly factory: IssueFactory,
  ) {}
}
