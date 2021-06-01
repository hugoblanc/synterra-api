import { HubRepository } from '../../core/framework/hub-service';
import { SpinalInterface } from '../../core/framework/spinal-model';
import { SpinalService } from '../../core/hub/spinal.service';
import { IssueListModel } from '../../nodes/issue-list';
export class IssueHubRepository extends HubRepository<any> {
  protected get emptyNode(): SpinalInterface {
    const emptyNode = {};
    emptyNode[this.ROOT_NAME] = [];
    // return new (require('../../nodes/issue-lists').IssueListModel)(emptyNode);
    return new IssueListModel(emptyNode);
  }

  protected readonly ROOT_NAME = 'issues';
  protected readonly NODE_NAME = 'last-issues';

  constructor(spinal: SpinalService) {
    super(spinal);
    console.log(
      'Spinal repository ------------------------------------------------',
    );
    console.log(spinal);
  }
}
