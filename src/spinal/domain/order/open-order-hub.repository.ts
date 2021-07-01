import { Injectable } from '@nestjs/common';
import { OrderDTO } from 'src/zelty/models/order.dto';
import { HubRepository } from '../../core/framework/hub-repository';
import { SpinalService } from '../../core/hub/spinal.service';
import { OpenOrderModel } from '../../models/open-orders/open-order';
import { OpenOrdersListModel } from '../../models/open-orders/open-orders-list';
// TODO faire dépendre le repository d'une definition externe du metier => l'entité

@Injectable()
export class OpenOrdersHubRepository extends HubRepository<
  OpenOrderModel,
  OrderDTO
> {
  protected get emptyNode(): OpenOrdersListModel {
    return new OpenOrdersListModel();
  }

  protected readonly NODE_NAME = 'open-orders';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
