import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderSpinalDomainService } from './order-spinal-domain.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly domainService: OrderSpinalDomainService) {}

  @Get()
  findAll(): Observable<any> {
    return this.domainService.findAll();
  }
}
