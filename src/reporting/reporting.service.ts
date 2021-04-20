import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDTO } from 'src/zelty/models/order';
import { MatrixReportingService } from './matrix/matrix-reporting.service';
import {
  OrderReportingService,
  OrderSumPriceDataCharts,
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

  getOrdersSummedPrices(): Observable<OrderSumPriceDataCharts> {
    return this.orderReportingService.getOrdersSummedPrices();
  }
}
