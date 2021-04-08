import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { addDays, format } from 'date-fns';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { Order } from 'src/zelty/models/order';
import { OrderService } from '../../../zelty/services/order.service';
import { SpinalInterface } from '../../core/framework/spinal-model';
import { OrderHubRepository } from './order-hub.repository';

type OrderNode = Order & SpinalInterface;
type OrderListNode = OrderNode[] & SpinalInterface & { orders: any[] };

@Injectable()
export class OrderSynchronizerService implements OnModuleInit {
  private logger = new Logger(OrderSynchronizerService.name);
  private orderList: OrderListNode;

  constructor(
    private readonly hubService: OrderHubRepository,
    private readonly orderService: OrderService,
  ) {}

  onModuleInit(): void {
    this.logger.log('Order synchro started');
    this.synchronize();
  }

  public synchronize(): void {
    const loadNodes$ = this.loadArray().pipe(
      catchError((error) => this.createIfUnknown(error)),
    );

    let orderList: OrderListNode;
    loadNodes$
      .pipe(
        take(1),
        map((nodes) => this.findSynchroLimite(nodes)),
        mergeMap((max?: string) => this.orderService.getOrders(max)),
        tap((orders) => {
          this.logger.log(`${orders.length} will be synchronized`);
          this.orderList.orders.concat(orders);
        }),
      )
      .subscribe();
  }

  private createIfUnknown(error: any): Observable<OrderNode[]> {
    this.logger.error(error);
    return this.hubService.store().pipe(mergeMap(() => this.loadArray()));
  }

  private loadArray(): Observable<OrderNode[]> {
    return this.hubService.load().pipe(
      map((nodes: OrderListNode): OrderNode[] => {
        this.orderList = nodes;

        if (this.orderList.orders.length === 0) {
          this.logger.log('No orders list in hub');
          return [];
        }

        const arr2d = (this.orderList.orders as any).get();
        return [].concat(...arr2d);
      }),
    );
  }

  private findSynchroLimite(nodes: OrderNode[]): string | undefined {
    let max = nodes.reduce((a, b) => (a.created_at > b.created_at ? a : b))
      .created_at;

    max = format(addDays(new Date(max), 1), 'yyyy-MM-dd');
    this.logger.log(`${max} is the last date found in hub`);

    return max;
  }
}
