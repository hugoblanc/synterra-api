import { Module } from '@nestjs/common';
import { ZeltyModule } from '../zelty/zelty.module';
import { DishSpinalModule } from './domain/dish-spinal/dish-spinal.module';
import { IssueModule } from './domain/issue/issue.module';
import { OrderModule } from './domain/order/order.module';

@Module({
  imports: [ZeltyModule, OrderModule, DishSpinalModule, IssueModule],
  controllers: [],
  exports: [OrderModule, DishSpinalModule, IssueModule],
})
export class SpinalModule {}
