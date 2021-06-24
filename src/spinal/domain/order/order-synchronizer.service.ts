import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { addDays, format } from 'date-fns';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { OrderStatusUpdateEvent } from '../../../event/zelty/order-status-update.event';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { OrderService } from '../../../zelty/services/order.service';
import { OrderHubRepository } from './order-hub.repository';
import { OrderListNode, OrderNode } from './order-spinal-domain.service';

@Injectable()
export class OrderSynchronizerService implements OnModuleInit {
  private logger = new Logger(OrderSynchronizerService.name);
  private orders: OrderNode[];

  constructor(
    private readonly orderHubRepository: OrderHubRepository,
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

    loadNodes$
      .pipe(
        take(1),
        map((nodes) => this.findSynchroLimit(nodes)),
        mergeMap((max?: string) => this.orderService.getAllOrders(max)),
        tap((orders: OrderDTO[]) => {
          this.logger.log(`${orders.length} will be synchronized`);
          this.orders.concat(orders as OrderNode[]);
        }),
      )
      .subscribe();
  }

  @OnEvent(OrderStatusUpdateEvent.EVENT_NAME)
  handleQuantityCreatedEvent(orderStatusUpdateEvent: OrderStatusUpdateEvent) {
    const getById$ = this.orderService.getOrderById(
      orderStatusUpdateEvent.update.id,
    );
    const nodeById$ = this.orderHubRepository.find<OrderNode>({
      id: orderStatusUpdateEvent.update.id,
    });

    forkJoin([getById$, nodeById$]).subscribe(
      (value: [OrderDTO, OrderNode[]]) => {
        const nodes = value[1];
        const order = value[0];

        if (nodes.length === 0) {
          this.orders.concat([order] as OrderNode[]);
          return;
        }

        for (const node of nodes) {
          (node as any).set(order);
        }
      },
    );
  }

  private createIfUnknown(error: any): Observable<OrderNode[]> {
    this.logger.error(error);
    return this.orderHubRepository
      .store()
      .pipe(mergeMap(() => this.loadArray()));
  }

  private loadArray(): Observable<OrderNode[]> {
    return this.orderHubRepository.load().pipe(
      take(1),
      map((nodes: OrderListNode): OrderNode[] => {
        this.orders = nodes.orders;

        if (this.orders.length === 0) {
          this.logger.log('No orders list in hub');
          return [];
        }

        const arr2d: OrderNode[][] = (this.orders as any).get();
        const orders: OrderNode[] = [].concat(...arr2d) as OrderNode[];
        return orders;
      }),
    );
  }

  private findSynchroLimit(nodes: OrderNode[] = []): string | undefined {
    let max = nodes.reduce<OrderNode>(
      (a, b) => (a.created_at > b.created_at ? a : b),
      {
        created_at: '01/01/2020',
      } as OrderNode,
    ).created_at;

    if (!max) {
      return undefined;
    }

    const maxDate = new Date(max);
    console.log(maxDate);
    max = format(addDays(maxDate, 1), 'yyyy-MM-dd');
    this.logger.log(`${max} is the last date found in hub`);

    return max;
  }
}
