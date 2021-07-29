import { Injectable } from '@nestjs/common';
import { HubRepository } from '@synterra/spinal-rxjs';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { SpinalService } from '../../core/hub/spinal.service';
import { OldOrderModel } from '../../models/old-orders/old-order';
import { OldOrdersListModel } from '../../models/old-orders/old-orders-list';

@Injectable()
export class OrderHubRepository extends HubRepository<OldOrderModel, OrderDTO> {
  readonly NODE_NAME = 'orders-list';

  protected get emptyNode(): OldOrdersListModel {
    return new OldOrdersListModel();
  }

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
