import { Injectable } from '@nestjs/common';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { IssueListModel } from '../../nodes/issue-list';

@Injectable()
export class IssueHubRepository extends HubRepository<any> {
  protected get emptyNode(): Model {
    const emptyNode = {};
    emptyNode[this.ROOT_NAME] = [];
    return new IssueListModel(emptyNode);
  }

  protected readonly ROOT_NAME = 'issues';
  protected readonly NODE_NAME = 'last-issues';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
