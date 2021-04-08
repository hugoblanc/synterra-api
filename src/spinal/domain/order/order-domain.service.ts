import { Injectable } from '@nestjs/common';
import { map, take } from 'rxjs/operators';
import { OrderHubRepository } from './order-hub.repository';
import { Order } from '../../../zelty/models/order';
import { SpinalInterface } from 'src/spinal/core/framework/spinal-model';

type OrderNode = Order & SpinalInterface;
type OrderListNode = OrderListNode[] & SpinalInterface & { orders: any[] };

@Injectable()
export class OrderDomainService {
  constructor(private readonly hubRepository: OrderHubRepository) {}

  findAll() {
    return this.hubRepository.load().pipe(
      take(1),
      map((nodes: OrderListNode): OrderNode[] => {
        if (nodes.orders.length === 0) {
          return [];
        }

        const arr2d = (nodes.orders as any).get();
        return [].concat(...arr2d);
      }),
    );
  }
}
