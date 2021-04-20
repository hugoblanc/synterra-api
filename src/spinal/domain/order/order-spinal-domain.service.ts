import { Injectable } from '@nestjs/common';
import { map, take } from 'rxjs/operators';
import { OrderHubRepository } from './order-hub.repository';
import { OrderDTO } from '../../../zelty/models/order';
import { SpinalInterface } from '../../core/framework/spinal-model';

export type OrderNode = OrderDTO & SpinalInterface;
export type OrderListNode = OrderNode[] & SpinalInterface & { orders: any[] };

// TODO remove dupplication with dish-spin-domain
@Injectable()
export class OrderSpinalDomainService {
  constructor(private readonly hubRepository: OrderHubRepository) {}

  findAll() {
    return this.hubRepository.load().pipe(
      take(1),
      map((nodes: OrderListNode): OrderDTO[] => {
        if (nodes.orders.length === 0) {
          return [];
        }

        return (nodes.orders as any).get();
      }),
    );
  }
}
