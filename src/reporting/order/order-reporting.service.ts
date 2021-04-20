import { Injectable } from '@nestjs/common';
import { OrderSpinalDomainService } from '../../spinal/domain/order/order-spinal-domain.service';
import { OrderDTO } from '../../zelty/models/order';
import { format } from 'date-fns';
import { map } from 'rxjs/operators';

export interface OrderSumPriceDataCharts {
  labels: number[];
  data: number[];
}

type SumDayMap = number[];

@Injectable()
export class OrderReportingService {
  constructor(
    private readonly orderSpinalDomainService: OrderSpinalDomainService,
  ) {}

  getOrders() {
    return this.orderSpinalDomainService.findAll();
  }

  getOrdersSummedPrices() {
    return this.getOrders().pipe(map((orders) => this.sumPerDays(orders)));
  }

  private sumPerDays(orders: OrderDTO[]) {
    const result = new Map<number, number>();
    orders.forEach((o) => {
      const createAt = new Date(
        format(new Date(o.created_at), 'MM/dd/yyyy'),
      ).getTime();

      let sum = result.get(createAt) ?? 0;
      sum += o.price;
      console.log(createAt);
      result.set(createAt, sum);
    });

    const resultAsArray = Array.from(result) as SumDayMap[];
    const sortedArray = this.sortByDate(resultAsArray);

    return this.separateLabelAndValue(sortedArray);
  }

  private sortByDate(days: SumDayMap[]) {
    return days.sort((a, b) => (a[0] > b[0] ? 1 : -1));
  }

  private separateLabelAndValue(array: SumDayMap[]): OrderSumPriceDataCharts {
    return array.reduce(
      (acc: OrderSumPriceDataCharts, day) => {
        acc.labels.push(day[0]);
        acc.data.push(day[1]);
        return acc;
      },
      {
        labels: [],
        data: [],
      },
    );
  }
}
