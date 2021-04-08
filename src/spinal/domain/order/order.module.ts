import { OrderController } from './order.controller';
import { Module } from '@nestjs/common';
import { HubModule } from '../../core/hub/hub.module';
import { OrderSynchronizerService } from './order-synchronizer.service';
import { OrderHubRepository } from './order-hub.repository';

@Module({
  imports: [HubModule],
  controllers: [OrderController],
  providers: [OrderSynchronizerService, OrderHubRepository],
})
export class OrderModule {}
