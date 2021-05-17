import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderCreatedEvent } from '../../../event/zelty/order-created.event';
import { OrderDTO } from '../../../zelty/models/order';
import { OrderService } from '../../../zelty/services/order.service';
import { OpenOrdersHubRepository } from './open-order-hub.repository';
import { OrderNode } from './order-spinal-domain.service';

@Injectable()
export class CronOrderService {
  private logger = new Logger(CronOrderService.name);

  constructor(
    private readonly openOrdersHubRepository: OpenOrdersHubRepository,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron('0 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 0');

    const load$ = this.openOrdersHubRepository.load().pipe(take(1));

    const opened$ = this.orderService.getOpenOrders();

    forkJoin([opened$, load$]).subscribe((value: [OrderDTO[], OrderNode[]]) => {
      const openedOrders = value[0];
      const nodesList = value[1];
      this.addMissingOrderToHub(openedOrders, nodesList);
      this.cleanHub(openedOrders, nodesList);
    });
  }

  private addMissingOrderToHub(
    openedOrders: OrderDTO[],
    nodesList: OrderNode[],
  ): void {
    const nodes = (nodesList as any).orders.get();

    openedOrders.forEach((o) => {
      const node = nodes.find((n: OrderNode) => n.id === o.id);
      if (!node) {
        this.logger.log('Node added to opened list ' + o.id);
        (nodesList as any).orders.concat([o]);

        this.sendOrderCreatedEvent(o);
      }
    });
  }

  private cleanHub(openedOrders: OrderDTO[], nodesList: OrderNode[]): void {
    const nodes = (nodesList as any).orders.get();
    const removableIndexes: number[] = [];

    nodes.forEach((n: OrderNode, i: number) => {
      if (!openedOrders.some((o) => o.id === n.id)) {
        removableIndexes.push(i);
      }
    });

    if (removableIndexes.length > 0) {
      this.logger.log(
        'Index to remove from opened list ' + removableIndexes.join(' - '),
      );
    }

    removableIndexes.forEach((index) =>
      (nodesList as any).orders.splice(index, 1),
    );
  }

  private sendOrderCreatedEvent(order: OrderDTO): void {
    const event = new OrderCreatedEvent(order);
    this.eventEmitter.emit(OrderCreatedEvent.EVENT_NAME, event);
  }
}