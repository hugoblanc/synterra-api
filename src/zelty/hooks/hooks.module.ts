import { HooksService } from './hooks.service';
import { HooksController } from './hooks.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [HooksController],
  providers: [HooksService],
})
export class HooksModule {}
