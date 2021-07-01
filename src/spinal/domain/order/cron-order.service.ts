import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { forkJoin } from 'rxjs';
import { OrderCreatedEvent as OrdersCreatedEvent } from '../../../event/zelty/order-created.event';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { OrderService } from '../../../zelty/services/order.service';
import { OpenOrderModel } from '../../models/open-orders/open-order';
import { OpenOrdersListModel } from '../../models/open-orders/open-orders-list';
import { OpenOrdersHubRepository } from './open-order-hub.repository';

@Injectable()
export class CronOrderService {
  private logger = new Logger(CronOrderService.name);

  static readonly CRON_TIME = '*/30 * * * * *';

  constructor(
    private readonly openOrdersHubRepository: OpenOrdersHubRepository,
    private readonly orderService: OrderService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronOrderService.CRON_TIME)
  handleCron() {
    this.logger.debug(CronOrderService.CRON_TIME);

    const spinalOrders$ = this.openOrdersHubRepository.load();

    const opened$ = this.orderService.getOpenOrders();

    forkJoin([opened$, spinalOrders$]).subscribe(
      (value: [OrderDTO[], OpenOrdersListModel]) => {
        const openedOrders = value[0];
        const nodesList = value[1];
        this.addMissingOrderToHub(openedOrders, nodesList);
        this.cleanHub(openedOrders, nodesList);
      },
    );
  }

  private addMissingOrderToHub(
    openedOrders: OrderDTO[],
    nodesList: OpenOrdersListModel,
  ): void {
    const nodes = (nodesList as any).orders.get();
    const ordersToCreate = [];
    openedOrders
      .filter((o) => o.ref != null)
      .forEach((o) => {
        const node = nodes.find((n: OpenOrderModel) => n.id.get() === o.id);
        if (!node) {
          this.logger.log(
            'Node added to opened list id: ' + o.id + ' uuid' + o.uuid,
          );
          nodesList.list.concat([new OpenOrderModel(o)]);
          ordersToCreate.push(o);
        }
      });
    this.sendOrdersCreatedEvent(ordersToCreate);
  }

  private cleanHub(
    openedOrders: OrderDTO[],
    nodesList: OpenOrdersListModel,
  ): void {
    const nodes = nodesList.list.get();
    const removableIndexes: number[] = [];

    nodes.forEach((n: OpenOrderModel, i: number) => {
      if (!openedOrders.some((o) => n.id.get() === o.id)) {
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

  private sendOrdersCreatedEvent(orders: OrderDTO[]): void {
    const event = new OrdersCreatedEvent(orders);
    this.eventEmitter.emit(OrdersCreatedEvent.EVENT_NAME, event);
  }
}
