import { Module } from '@nestjs/common';
import { ZeltyModule } from '../zelty/zelty.module';
import { OrderModule } from './domain/order/order.module';

@Module({
  imports: [ZeltyModule, OrderModule],
  controllers: [],
})
export class SpinalModule {}
