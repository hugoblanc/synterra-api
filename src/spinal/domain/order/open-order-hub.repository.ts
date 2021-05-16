import { Injectable } from '@nestjs/common';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalInterface } from '../../core/framework/spinal-model';
import { SpinalService } from '../../core/hub/spinal.service';
import { OrderListNode } from './order-spinal-domain.service';
// TODO faire dépendre le repository d'une definition externe du metier => l'entité

@Injectable()
export class OpenOrdersHubRepository extends HubRepository<OrderListNode> {
  protected get emptyNode(): SpinalInterface {
    const emptyNode = {};
    emptyNode[this.ROOT_NAME] = [];
    return new (require('../../nodes/open-orders').OpenOrdersModel)(emptyNode);
  }

  protected readonly ROOT_NAME = 'orders';
  protected readonly NODE_NAME = 'open-orders';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
