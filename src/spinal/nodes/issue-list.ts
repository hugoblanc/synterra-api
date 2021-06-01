import { IssueChangelogDTO } from '../../jira/jira-analytics/models/jira-issue-changelog.dto';
require('spinal-core-connectorjs');

export class IssueListModel extends Model {
  private static emptyNode = { issues: [] };
  static ROOT_NAME = 'issues';
  static NODE_NAME = 'last-issues';

  issues: Lst<IssueChangelogDTO>;
  constructor(attrs = IssueListModel.emptyNode) {
    super();
    this.add_attr(attrs);
  }
}
