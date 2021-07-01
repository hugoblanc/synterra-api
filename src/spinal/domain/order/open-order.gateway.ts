import { Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
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
      const orderNode = (openOrders as any).orders;
      const modifiedNodes = orderNode.filter((n) => n.has_been_modified());
      this.logger.log('Changes detected ' + modifiedNodes.length);
    });
  }
}
