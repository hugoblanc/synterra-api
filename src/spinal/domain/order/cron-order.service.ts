import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { forkJoin } from 'rxjs';
import { OrdersCreatedEvent } from '../../../event/zelty/order-created.event';
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
    const nodes: OrderDTO[] = nodesList.list.get();
    const ordersToCreate = [];
    const ordersCreated = [];
    openedOrders
      .filter((o) => o.ref != null)
      .forEach((o) => {
        const node = nodes.find((n: OrderDTO) => n.id === o.id);
        if (!node) {
          this.logger.log(
            'Node added to opened list id: ' + o.id + ' uuid' + o.uuid,
          );
          nodesList.list.concat([new OpenOrderModel(o)]);
          ordersToCreate.push(o);
        } else {
          ordersCreated.push(o);
        }
      });

    this.logger.log(
      `ordersToCreate: ${ordersToCreate.length} ordersCreated: ${ordersCreated.length} `,
    );
    this.sendOrdersCreatedEvent(ordersToCreate, ordersCreated);
  }

  private cleanHub(
    openedOrders: OrderDTO[],
    nodesList: OpenOrdersListModel,
  ): void {
    const nodes: OrderDTO[] = nodesList.list.get();
    const removableIndexes: number[] = [];

    nodes.forEach((n: OrderDTO, i: number) => {
      if (!openedOrders.some((o) => n.id === o.id)) {
        removableIndexes.push(i);
      }
    });

    if (removableIndexes.length > 0) {
      this.logger.log(
        'Index to remove from opened list ' + removableIndexes.join(' - '),
      );
    }

    removableIndexes.forEach((index) => nodesList.list.splice(index, 1));
  }

  private sendOrdersCreatedEvent(
    orders: OrderDTO[],
    ordersCreated: OrderDTO[],
  ): void {
    const event = new OrdersCreatedEvent(orders, ordersCreated);
    this.eventEmitter.emit(OrdersCreatedEvent.EVENT_NAME, event);
  }
}
