import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
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
  ) {}

  @Cron('0 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');

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
}
