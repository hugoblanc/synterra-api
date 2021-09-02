import { Module } from '@nestjs/common';
import { HubModule } from '@synterra/shared';
import { ZeltyModule } from '../../../zelty/zelty.module';
import { CronOrderService } from './cron-order.service';
import { OpenOrdersHubRepository } from './open-order-hub.repository';
import { OpenOrderGateway } from './open-order.gateway';
import { OpenOrderService } from './open-order.service';
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
    OpenOrderService,
  ],
  exports: [OrderSpinalDomainService],
})
export class OrderModule {}
