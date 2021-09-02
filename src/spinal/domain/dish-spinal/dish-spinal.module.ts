import { Module } from '@nestjs/common';
import { HubModule } from '@synterra/shared';
import { DishHubRepository } from './dish-hub.repository';
import { DishSpinalDomainService } from './dish-spinal-domain.service';
import { DishSynchronizerService } from './dish-synchronizer.service';

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
