import { Body, Controller, Put } from '@nestjs/common';
import { OrderStatusUpdate } from '../models/order-status';
import { HooksService } from './hooks.service';

@Controller('zelty/hooks')
export class HooksController {
  constructor(private readonly hooksService: HooksService) {}

  @Put('order-status')
  updateOrderStatus(@Body() status: OrderStatusUpdate) {
    this.hooksService.updateOrderStatus(status);
    return;
  }
}
