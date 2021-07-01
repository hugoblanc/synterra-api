import { Injectable } from '@nestjs/common';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { OpenOrdersModel } from '../../nodes/open-orders';
import { OrderListNode } from './order-spinal-domain.service';
// TODO faire dépendre le repository d'une definition externe du metier => l'entité

@Injectable()
export class OpenOrdersHubRepository extends HubRepository<OrderListNode> {
  protected get emptyNode(): spinal.Model {
    return new OpenOrdersModel();
  }

  protected readonly ROOT_NAME = 'orders';
  protected readonly NODE_NAME = 'open-orders';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
