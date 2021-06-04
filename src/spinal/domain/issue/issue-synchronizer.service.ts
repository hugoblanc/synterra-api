import { Injectable, Logger } from '@nestjs/common';
import { take, tap } from 'rxjs/operators';
import { IssueChangelogDTO } from '../../../jira/jira-analytics/models/jira-issue-changelog.dto';
import { IssueHubRepository } from './issue-hub.repository';

@Injectable()
export class IssueSynchronizerService {
  logger = new Logger(IssueSynchronizerService.name);
  constructor(private readonly hub: IssueHubRepository) {}

  add(issue: IssueChangelogDTO) {
    return this.hub.load().pipe(
      take(1),
      tap((issuesList) => {
        this.logger.log('Webbhook triggered');
        removeNested(issue, 'toString');
        const spinalIssues = issuesList.issues.filter((i) => i.id === issue.id);
        const spinalIssue = spinalIssues[0];
        try {
          if (!spinalIssue) {
            this.logger.log('Issue not existing');
            issuesList.issues.push(issue);
          } else {
            this.logger.log('Issue already existing');
            issuesList.issues.remove(spinalIssue);
            issuesList.issues.push(issue);
          }
        } catch (error) {
          console.error(error);
          console.error(issue);
        }
      }),
    );
  }
}

/**
 * Copy past from stack overflow
 * @param obj object to scan
 * @param key key to delete
 */
function removeNested(obj, key) {
  let i;

  const proto = Object.prototype,
    ts = proto.toString,
    hasOwn = proto.hasOwnProperty.bind(obj);

  for (i in obj) {
    if (hasOwn(i)) {
      if (i === key) {
        delete obj[i];
      } else if (
        '[object Array]' === ts.call(obj[i]) ||
        '[object Object]' === ts.call(obj[i])
      ) {
        removeNested(obj[i], key);
      }
    }
  }
}
