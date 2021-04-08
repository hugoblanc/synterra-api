import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { addDays, format } from 'date-fns';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { Order } from 'src/zelty/models/order';
import { OrderService } from '../../zelty/services/order.service';
import { SpinalInterface } from '../models/spinal-model';
import { SpinalService } from './spinal.service';

type OrderNode = Order & SpinalInterface;
type OrderListNode = OrderNode[] & SpinalInterface & { orders: any[] };

@Injectable()
export class OrderSynchronizerService implements OnModuleInit {
  private static NODE_NAME = 'orders-list';
  private logger = new Logger(OrderSynchronizerService.name);

  constructor(
    private readonly spinal: SpinalService,
    private readonly orderService: OrderService,
  ) {}

  onModuleInit() {
    this.logger.log('Order synchro started');
    this.synchronize();
  }

  public synchronize(): void {
    const loadNodes$ = this.load().pipe(
      catchError((error) => this.createIfUnknown(error)),
    );

    let orderList: OrderListNode;
    loadNodes$
      .pipe(
        take(1),
        map((nodes: OrderListNode): string | undefined => {
          orderList = nodes as OrderListNode;
          if (orderList.orders.length === 0) {
            this.logger.log('No orders list in hub');
            return;
          }

          const arr2d = (orderList.orders as any).get();
          const arr1d = [].concat(...arr2d);

          let max = arr1d.reduce((a, b) =>
            a.created_at > b.created_at ? a : b,
          ).created_at;

          max = format(addDays(new Date(max), 1), 'yyyy-MM-dd');

          console.log(max);
          return max;
        }),
        mergeMap((max?: string) => this.orderService.getOrders(max)),
        tap((orders) => {
          console.log('No sync orders');
          console.log(orders.length);
          orderList.orders.concat(orders);
        }),
      )
      .subscribe();
  }

  private createIfUnknown(error): Observable<any> {
    const listModel = require('../nodes/orders-list');
    const ordersList = new listModel.OrdersListModel({ orders: [] });
    return this.spinal
      .store(ordersList, OrderSynchronizerService.NODE_NAME)
      .pipe(mergeMap(() => this.load()));
  }

  private load(): Observable<any> {
    return this.spinal.load(OrderSynchronizerService.NODE_NAME);
  }
}
