import { Module } from '@nestjs/common';
import { SpinalService } from './spinal.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SpinalService],
  exports: [SpinalService],
})
export class HubModule {}
