import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../../zelty/models/order';
import { SpinalInterface } from '../../core/framework/spinal-model';
import { OrderHubRepository } from './order-hub.repository';

export type OrderNode = OrderDTO & SpinalInterface;
export type OrderListNode = OrderNode[] & SpinalInterface & { orders: any[] };

// TODO remove dupplication with dish-spin-domain
@Injectable()
export class OrderSpinalDomainService {
  constructor(private readonly hubRepository: OrderHubRepository) {}

  findAll(): Observable<OrderDTO[]> {
    return this.hubRepository.findAll<OrderDTO>();
  }
}
