import { Controller, Get } from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderSer);

  @Get()
  findAll(): void {}
}
