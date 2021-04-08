import { HttpModule, Module } from '@nestjs/common';
import { ZeltyHttpService } from './core/zelty-http.service';
import { OrderService } from './services/order.service';
import { DishZeltyService } from './services/dish-zelty.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ZeltyHttpService, OrderService, DishZeltyService],
  exports: [OrderService, DishZeltyService],
})
export class ZeltyModule {}
