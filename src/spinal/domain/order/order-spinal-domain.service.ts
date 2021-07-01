import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { OrderHubRepository } from './order-hub.repository';

export type OrderNode = OrderDTO & spinal.Model;
export type OrderListNode = OrderNode[] & spinal.Model & { orders: any[] };

@Injectable()
export class OrderSpinalDomainService {
  constructor(private readonly hubRepository: OrderHubRepository) {}

  findAll(): Observable<OrderDTO[]> {
    return this.hubRepository.findAll<OrderDTO>();
  }
}
