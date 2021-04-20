import { OrderController } from './order.controller';
import { Module } from '@nestjs/common';
import { HubModule } from '../../core/hub/hub.module';
import { OrderSynchronizerService } from './order-synchronizer.service';
import { OrderHubRepository } from './order-hub.repository';
import { OrderSpinalDomainService } from './order-spinal-domain.service';
import { ZeltyModule } from '../../../zelty/zelty.module';

@Module({
  imports: [HubModule, ZeltyModule],
  controllers: [OrderController], // TODO Dégager ce controller d'ici
  providers: [
    OrderSynchronizerService,
    OrderHubRepository,
    OrderSpinalDomainService,
  ],
  exports: [OrderSpinalDomainService],
})
export class OrderModule {}
