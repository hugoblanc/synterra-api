import { Module } from '@nestjs/common';
import { ProductListService } from './services/product-list.service';
import { SpinalService } from './services/spinal.service';
import { ZeltyModule } from '../zelty/zelty.module';
import { OrderSynchronizerService } from './services/order-synchronizer.service';

@Module({
  imports: [ZeltyModule],
  controllers: [],
  providers: [SpinalService, ProductListService, OrderSynchronizerService],
  exports: [ProductListService, OrderSynchronizerService],
})
export class SpinalModule {}
