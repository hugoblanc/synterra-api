import { Injectable, Logger } from '@nestjs/common';
import { IssueSpinalDomainService } from '../../spinal/domain/issue/issue-spinal-domain.service';
import { IssueSynchronizerService } from '../../spinal/domain/issue/issue-synchronizer.service';
import { JiraWebhookEvent } from './models/jira-webhook.model';

@Injectable()
export class JiraAnalyticsService {
  logger = new Logger(JiraAnalyticsService.name);
  constructor(
    private readonly issueSpinalDomainService: IssueSpinalDomainService,
    private readonly synchronizer: IssueSynchronizerService,
  ) {}

  handleWebhook(payload: JiraWebhookEvent): void {
    console.log(payload);
    console.log(payload);
    // this.issueSpinalDomainService.findAll().subscribe((dishes) => {
    //   console.log(dishes);
    // });

    this.synchronizer.store();
    this.logger.log('Hub interaction finished');
  }
}
