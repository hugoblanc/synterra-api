import { Injectable } from '@nestjs/common';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { IssueListModel } from '../../nodes/issue-list';

@Injectable()
export class IssueHubRepository extends HubRepository<IssueListModel> {
  protected get emptyNode(): Model {
    return new IssueListModel();
  }

  protected readonly ROOT_NAME = 'issues';
  protected readonly NODE_NAME = 'last-issues';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
