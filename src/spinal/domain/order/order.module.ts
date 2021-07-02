import { Module } from '@nestjs/common';
import { ZeltyModule } from '../../../zelty/zelty.module';
import { HubModule } from '../../core/hub/hub.module';
import { CronOrderService } from './cron-order.service';
import { OpenOrdersHubRepository } from './open-order-hub.repository';
import { OpenOrderGateway } from './open-order.gateway';
import { OrderHubRepository } from './order-hub.repository';
import { OrderSpinalDomainService } from './order-spinal-domain.service';
import { OrderSynchronizerService } from './order-synchronizer.service';

@Module({
  imports: [HubModule, ZeltyModule],
  providers: [
    OrderSynchronizerService,
    OrderHubRepository,
    OpenOrdersHubRepository,
    OrderSpinalDomainService,
    CronOrderService,
    OpenOrderGateway,
  ],
  exports: [OrderSpinalDomainService],
})
export class OrderModule {}
