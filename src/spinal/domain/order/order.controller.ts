import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDomainService } from './order-domain.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly domainService: OrderDomainService) {}

  @Get()
  findAll(): Observable<any> {
    return this.domainService.findAll();
  }
}
