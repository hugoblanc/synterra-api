import { HttpModule, Module } from '@nestjs/common';
import { ZeltyHttpService } from './core/zelty-http.service';
import { HooksModule } from './hooks/hooks.module';
import { DishZeltyService } from './services/dish-zelty.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [HttpModule, HooksModule],
  controllers: [],
  providers: [ZeltyHttpService, OrderService, DishZeltyService],
  exports: [OrderService, DishZeltyService],
})
export class ZeltyModule {}
