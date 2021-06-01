import { Injectable } from '@nestjs/common';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { OrderListNode } from './order-spinal-domain.service';
// TODO faire dépendre le repository d'une definition externe du metier => l'entité

@Injectable()
export class OrderHubRepository extends HubRepository<OrderListNode> {
  protected get emptyNode(): Model {
    const emptyNode = {};
    emptyNode[this.ROOT_NAME] = [];
    return new (require('../../nodes/orders-list').OrdersListModel)(emptyNode);
  }

  readonly ROOT_NAME = 'orders';
  readonly NODE_NAME = 'orders-list';

  constructor(spinal: SpinalService) {
    super(spinal);
    console.log(
      'Spinal repository ------------------------------------------------',
    );
    console.log(spinal);
  }
}
