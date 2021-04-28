import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDTO } from 'src/zelty/models/order';
import { MatrixReportingService } from './matrix/matrix-reporting.service';
import { AverageDuration, AveragePrice } from './order/order-reporting.service';
import {
  OrderReportingService,
  ActionOrderGroupedPerDay,
} from './order/order-reporting.service';

@Injectable()
export class ReportingService {
  constructor(
    private readonly matrixService: MatrixReportingService,
    private readonly orderReportingService: OrderReportingService,
  ) {}

  getMatrix(): Observable<number[][]> {
    return this.matrixService.generateMatrix();
  }

  getOrders(): Observable<OrderDTO[]> {
    return this.orderReportingService.getOrders();
  }

  getOrdersSummedPrices(): Observable<ActionOrderGroupedPerDay> {
    return this.orderReportingService.getOrdersSummedPrices();
  }

  countOrdersPerDay(): Observable<ActionOrderGroupedPerDay> {
    return this.orderReportingService.countOrdersPerDays();
  }

  countAverageDeliveryTime(): Observable<AverageDuration> {
    return this.orderReportingService.countAverageDeliveryTime();
  }

  countAveragePreparationTime(): Observable<AverageDuration> {
    return this.orderReportingService.countAveragePreparationTime();
  }

  countAverageOrderPrice(): Observable<AveragePrice> {
    return this.orderReportingService.countAverageOrderPrice();
  }
}
