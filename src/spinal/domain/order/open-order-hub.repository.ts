import { Injectable } from '@nestjs/common';
import { SpinalService } from '@synterra/shared';
import { ListHubRepository } from '@synterra/spinal-rxjs';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { OpenOrderModel } from '../../models/open-orders/open-order';
import { OpenOrdersListModel } from '../../models/open-orders/open-orders-list';

@Injectable()
export class OpenOrdersHubRepository extends ListHubRepository<
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
