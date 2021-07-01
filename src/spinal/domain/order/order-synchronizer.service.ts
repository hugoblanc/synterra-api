import { Injectable, Logger } from '@nestjs/common';
import { OrderService } from '../../../zelty/services/order.service';
import { OrderHubRepository } from './order-hub.repository';
import { OldOrdersListModel } from '../../models/old-orders/old-orders-list';

@Injectable()
export class OrderSynchronizerService {
  private logger = new Logger(OrderSynchronizerService.name);
  private oldOrdersList: OldOrdersListModel;

  constructor(
    private readonly orderHubRepository: OrderHubRepository,
    private readonly orderService: OrderService,
  ) {}

  // onModuleInit(): void {
  //   this.logger.log('Order synchro started');
  //   this.synchronize();
  // }

  // public synchronize(): void {
  //   const loadNodes$ = this.loadArray().pipe(
  //     catchError((error) => this.createIfUnknown(error)),
  //   );

  //   loadNodes$
  //     .pipe(
  //       map((nodes) => this.findSynchroLimit(nodes)),
  //       mergeMap((max?: string) => this.orderService.getAllOrders(max)),
  //       tap((orders: OrderDTO[]) => {
  //         this.logger.log(`${orders.length} will be synchronized`);
  //         this.oldOrdersList.list.concat(
  //           orders.map((o) => new OldOrderModel(o)),
  //         );
  //       }),
  //     )
  //     .subscribe();
  // }

  // private createIfUnknown(error: any): Observable<OldOrderModel[]> {
  //   this.logger.error(error);
  //   return this.orderHubRepository
  //     .store()
  //     .pipe(mergeMap(() => this.loadArray()));
  // }

  // private loadArray(): Observable<OldOrderModel[]> {
  //   return this.orderHubRepository.load().pipe(
  //     map((nodes: OldOrdersListModel): OldOrderModel[] => {
  //       this.oldOrdersList = nodes;

  //       if (this.oldOrdersList.length === 0) {
  //         this.logger.log('No orders list in hub');
  //         return [];
  //       }

  //       const arr2d: OldOrderModel[][] = (this.oldOrdersList as any).get();
  //       const orders: OldOrderModel[] = [].concat(...arr2d);
  //       return orders;
  //     }),
  //   );
  // }

  // private findSynchroLimit(nodes: OldOrderModel[]): string | undefined {
  //   let max = nodes.reduce((a, b) => (a.created_at > b.created_at ? a : b), {
  //     created_at: '01/01/2020',
  //   }).created_at;

  //   if (!max) {
  //     return undefined;
  //   }

  //   const maxDate = new Date(max);
  //   console.log(maxDate);
  //   max = format(addDays(maxDate, 1), 'yyyy-MM-dd');
  //   this.logger.log(`${max} is the last date found in hub`);

  //   return max;
  // }
}
