import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ZeltyHttpService } from './core/zelty-http.service';
import { DishZeltyService } from './services/dish-zelty.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ZeltyHttpService, OrderService, DishZeltyService],
  exports: [OrderService, DishZeltyService],
})
export class ZeltyModule {}
