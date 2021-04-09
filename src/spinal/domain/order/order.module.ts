import { OrderController } from './order.controller';
import { Module } from '@nestjs/common';
import { HubModule } from '../../core/hub/hub.module';
import { OrderSynchronizerService } from './order-synchronizer.service';
import { OrderHubRepository } from './order-hub.repository';
import { OrderDomainService } from './order-domain.service';
import { ZeltyModule } from '../../../zelty/zelty.module';

@Module({
  imports: [HubModule, ZeltyModule],
  controllers: [OrderController], // TODO Dégager ce controller d'ici
  providers: [OrderSynchronizerService, OrderHubRepository, OrderDomainService],
  exports: [OrderDomainService],
})
export class OrderModule {}
