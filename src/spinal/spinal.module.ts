import { Module } from '@nestjs/common';
import { ZeltyModule } from '../zelty/zelty.module';
import { OrderModule } from './domain/order/order.module';
import { DishSpinalModule } from './domain/dish-spinal/dish-spinal.module';

@Module({
  imports: [ZeltyModule, OrderModule, DishSpinalModule],
  controllers: [],
  exports: [OrderModule, DishSpinalModule],
})
export class SpinalModule {}
