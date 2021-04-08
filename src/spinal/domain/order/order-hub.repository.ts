import { Injectable } from '@nestjs/common';
import { SpinalService } from '../../core/hub/spinal.service';
import { HubService } from '../../core/framework/hub-service';
import { Observable } from 'rxjs';
const listModel = require('../../nodes/orders-list');

@Injectable()
export class OrderHubRepository implements HubService {
  readonly NODE_NAME = 'orders-list';

  constructor(private readonly spinal: SpinalService) {}

  store(node = new listModel.OrdersListModel({ orders: [] })) {
    return this.spinal.store(node, this.NODE_NAME);
  }

  load(): Observable<any> {
    return this.spinal.load(this.NODE_NAME);
  }
}
