import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { OrderHubRepository } from './order-hub.repository';

export type OrderNode = OrderDTO & Model;
export type OrderListNode = OrderNode[] & Model & { orders: any[] };

@Injectable()
export class OrderSpinalDomainService {
  constructor(private readonly hubRepository: OrderHubRepository) {}

  findAll(): Observable<OrderDTO[]> {
    return this.hubRepository.findAll<OrderDTO>();
  }
}
