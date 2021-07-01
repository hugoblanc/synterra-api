import { Model } from 'spinal-core-connectorjs_type';

export class IssueListModel extends Model {
  private static emptyNode = { issues: [] };
  static ROOT_NAME = 'issues';
  static NODE_NAME = 'last-issues';

  // issues: spinal.Lst<IssueChangelogDTO>;
  issues: spinal.Lst<any>;
  constructor(attrs = IssueListModel.emptyNode) {
    super();
    this.add_attr(attrs);
  }
}
