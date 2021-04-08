import { Module } from '@nestjs/common';
import { HubModule } from '../../core/hub/hub.module';
import { DishHubRepository } from './dish-hub.repository';
import { DishSynchronizerService } from './dish-synchronizer.service';
import { DishSpinalDomainService } from './dish-spinal-domain.service';

@Module({
  imports: [HubModule],
  providers: [
    DishSynchronizerService,
    DishHubRepository,
    DishSpinalDomainService,
  ],
  exports: [DishSynchronizerService, DishSpinalDomainService],
})
export class DishSpinalModule {}
