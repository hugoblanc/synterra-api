import { Module } from '@nestjs/common';
import { HubModule } from '../../core/hub/hub.module';
import { DishHubRepository } from './dish-hub.repository';
import { DishSynchronizerService } from './dish-synchronizer.service';

@Module({
  imports: [HubModule],
  providers: [DishSynchronizerService, DishHubRepository],
  exports: [DishSynchronizerService],
})
export class DishSpinalModule {}
