import { Injectable } from '@nestjs/common';
import { SpinalInterface } from 'src/spinal/core/framework/spinal-model';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { OrderListNode } from './order-domain.service';
// TODO faire dépendre le repository d'une definition externe du metier => l'entité

@Injectable()
export class OrderHubRepository extends HubRepository<OrderListNode> {
  protected get emptyNode(): SpinalInterface {
    return new (require('../../nodes/orders-list').OrdersListModel)({
      orders: [],
    });
  }
  readonly NODE_NAME = 'orders-list';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
