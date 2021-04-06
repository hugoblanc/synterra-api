import { Injectable, OnModuleInit } from '@nestjs/common';
import { forkJoin, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { OrderService } from '../../zelty/services/order.service';
import { SpinalService } from './spinal.service';

@Injectable()
export class OrderSynchronizerService implements OnModuleInit {
  private static NODE_NAME = 'orders-list';

  constructor(
    private readonly spinal: SpinalService,
    private readonly orderService: OrderService,
  ) {}

  onModuleInit() {
    console.log('Start synchronize');
    this.synchronize2();
  }

  public synchronize2(): void {
    const nodes$ = this.load().pipe(
      catchError((error) => this.createIfUnknown(error)),
    );
    const orders$ = this.orderService.getOrders();

    forkJoin([nodes$, orders$]).subscribe(([nodes, orders]) => {
      console.log('Nodes spinal');
      console.log(nodes);
      console.log('Orders zelty');
      console.log(orders);
    });
  }

  // public synchronize(): Observable<void> {
  //   return this.orderService.getOrders().pipe(
  //     map((orders) => new listModel.OrdersListModel(orders)),
  //     mergeMap((spinalModel) => this.spinal.store(spinalModel, 'orders-list')),
  //     catchError((err) => this.spinal),
  //   );
  // }

  private createIfUnknown(error): Observable<any> {
    const listModel = require('../nodes/orders-list');
    const ordersList = new listModel.OrdersListModel({ to: 2 });
    return this.spinal
      .store(ordersList, OrderSynchronizerService.NODE_NAME)
      .pipe(mergeMap(() => this.load()));
  }

  private load(): Observable<any> {
    return this.spinal.load(OrderSynchronizerService.NODE_NAME);
  }
}
