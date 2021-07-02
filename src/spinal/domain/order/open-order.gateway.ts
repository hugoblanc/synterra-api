import { Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OpenOrderModel } from '../../models/open-orders/open-order';
import { OpenOrdersHubRepository } from './open-order-hub.repository';

@WebSocketGateway()
export class OpenOrderGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(OpenOrderGateway.name);

  constructor(
    private readonly openOrderHubRepository: OpenOrdersHubRepository,
  ) {}

  onModuleInit() {
    this.openOrderHubRepository.watch().subscribe((openOrders) => {
      const orderNode = openOrders.list;
      const modifiedNodes: spinal.Lst<OpenOrderModel> = orderNode.filter((n) =>
        n.has_been_modified(),
      ) as any;
      this.logger.log('Changes detected ' + modifiedNodes.length);
    });
  }
}
