import { HttpModule, Module } from '@nestjs/common';
import { ZeltyHttpService } from './core/zelty-http.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ZeltyHttpService, OrderService],
  exports: [OrderService],
})
export class ZeltyModule {}
