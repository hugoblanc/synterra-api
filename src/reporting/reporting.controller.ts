import { Controller, Get, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReportingService } from './reporting.service';
import {
  ActionOrderGroupedPerDay,
  AverageDuration,
} from './order/order-reporting.service';
import { OrderDTO } from '../zelty/models/order';
import { JwtAuthGuard } from '../core/auth/jwt.guard';
import { AveragePrice } from './order/order-reporting.service';

@Controller('reporting')
@UseGuards(JwtAuthGuard)
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
  getOrdersSummedPrices(): Observable<ActionOrderGroupedPerDay> {
    return this.reportingService.getOrdersSummedPrices();
  }

  @Get('count-orders-per-day')
  countOrderPerDay(): Observable<ActionOrderGroupedPerDay> {
    return this.reportingService.countOrdersPerDay();
  }

  @Get('count-average-delivery-time')
  countAverageDeliveryTime(): Observable<AverageDuration> {
    return this.reportingService.countAverageDeliveryTime();
  }

  @Get('count-average-preparation-time')
  countAveragePreparationTime(): Observable<AverageDuration> {
    return this.reportingService.countAveragePreparationTime();
  }

  @Get('count-average-order-price')
  countAverageOrderPrice(): Observable<AveragePrice> {
    return this.reportingService.countAverageOrderPrice();
  }
}
