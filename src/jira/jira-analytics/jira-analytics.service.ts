import { Injectable, Logger } from '@nestjs/common';
import { IssueSpinalDomainService } from '../../spinal/domain/issue/issue-spinal-domain.service';
import { IssueSynchronizerService } from '../../spinal/domain/issue/issue-synchronizer.service';
import { JiraTaskService } from '../jira-task/jira-task.service';
import { JiraWebhookEvent } from './models/jira-webhook.model';

@Injectable()
export class JiraAnalyticsService {
  logger = new Logger(JiraAnalyticsService.name);
  constructor(
    private readonly jiraTaskService: JiraTaskService,
    private readonly issueSpinalDomainService: IssueSpinalDomainService,
    private readonly synchronizer: IssueSynchronizerService,
  ) {}

  handleWebhook(payload: JiraWebhookEvent): void {
    console.log(payload);

    const issueId = payload.issue.id;

    // this.issueSpinalDomainService.findAll().subscribe((dishes) => {
    //   console.log(dishes);
    // });
    // const issue$ = this.jiraTaskService.getWithChangelogById(issueId);
    // issue$.pipe(mergeMap((issue) => this.synchronizer.add(issue))).subscribe();

    this.logger.log('Hub interaction finished');
  }
}
