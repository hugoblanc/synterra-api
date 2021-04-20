import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReportingService } from './reporting.service';
import { OrderSumPriceDataCharts } from './order/order-reporting.service';
import { OrderDTO } from '../zelty/models/order';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('matrix')
  generateMatrix(): Observable<number[][]> {
    return this.reportingService.getMatrix();
  }

  @Get('orders')
  getOrders(): Observable<OrderDTO[]> {
    return this.reportingService.getOrders();
  }

  @Get('orders-summed-prices')
  getOrdersSummedPrices(): Observable<OrderSumPriceDataCharts> {
    return this.reportingService.getOrdersSummedPrices();
  }
}
