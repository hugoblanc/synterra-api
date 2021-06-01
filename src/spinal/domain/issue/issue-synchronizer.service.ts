import { Injectable, Logger } from '@nestjs/common';
import { take, tap } from 'rxjs/operators';
import { IssueChangelogDTO } from '../../../jira/jira-analytics/models/jira-issue-changelog.dto';
import { IssueHubRepository } from './issue-hub.repository';

@Injectable()
export class IssueSynchronizerService {
  logger = new Logger(IssueSynchronizerService.name);
  constructor(private readonly hub: IssueHubRepository) {}

  add(issue: IssueChangelogDTO) {
    console.log(issue);

    return this.hub.load().pipe(
      take(1),
      tap((issuesList) => {
        this.logger.log('Webbhook triggered');
        (issuesList.issues as any).set([issue]);
        // require('spinal-core-connectorjs');
        // const spinalIssues = issuesList.issues.filter((i) => i.id === issue.id);
        // const spinalIssue = spinalIssues[0];
        // if (!spinalIssue) {
        //   issuesList.issues.concat([issue] as any);
        // } else {
        //   issuesList.issues.remove(spinalIssue);
        //   issuesList.issues.push(issue);
        // }
      }),
    );
  }
}
