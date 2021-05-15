import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArrayHelper } from '../../core/shared/helper/array.helper';
import { OrderSpinalDomainService } from '../../spinal/domain/order/order-spinal-domain.service';
import { OrderDTO } from '../../zelty/models/order';

export interface ActionOrderGroupedPerDay {
  labels: number[];
  data: number[];
}

export interface AverageDuration {
  avgDuration: number;
}

export interface AveragePrice {
  avgPrice: number;
}

type SumDayMap = number[];

@Injectable()
export class OrderReportingService {
  constructor(
    private readonly orderSpinalDomainService: OrderSpinalDomainService,
  ) {}

  public getOrders() {
    return this.orderSpinalDomainService.findAll();
  }

  public getOrdersSummedPrices() {
    return this.getOrders().pipe(
      map((orders) =>
        this.processActionsPerDay(orders, (o, sum) => (sum += o.price)),
      ),
    );
  }

  public countOrdersPerDays() {
    return this.getOrders().pipe(
      map((orders) =>
        this.processActionsPerDay(orders, (o, sum) => (sum += 1)),
      ),
    );
  }

  public countAverageDeliveryTime(): Observable<AverageDuration> {
    return this.countAverageTime(this.getDeliveryDurations);
  }

  public countAveragePreparationTime(): Observable<AverageDuration> {
    return this.countAverageTime(this.getPreparationDurations);
  }

  public countAverageOrderPrice(): Observable<AveragePrice> {
    return this.getOrders().pipe(
      map((orders) => orders.map((o) => o.price)),
      map((prices) => ({
        avgPrice: ArrayHelper.arrayAverage(prices),
      })),
    );
  }

  private processActionsPerDay(
    orders: OrderDTO[],
    callbackAction: (order: OrderDTO, sum: number) => number,
  ) {
    const result = new Map<number, number>();

    orders.forEach((o) => {
      if (o.created_at) {
        const createAt = new Date(
          format(new Date(o.created_at), 'MM/dd/yyyy'),
        ).getTime();

        let sum = result.get(createAt) ?? 0;
        sum = callbackAction(o, sum);
        result.set(createAt, sum);
      }
    });

    const resultAsArray = Array.from(result) as SumDayMap[];
    const sortedArray = this.sortByDate(resultAsArray);

    return this.separateLabelAndValue(sortedArray);
  }

  private sortByDate(days: SumDayMap[]) {
    return days.sort((a, b) => (a[0] > b[0] ? 1 : -1));
  }

  private separateLabelAndValue(array: SumDayMap[]): ActionOrderGroupedPerDay {
    return array.reduce(
      (acc: ActionOrderGroupedPerDay, day) => {
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

  private countAverageTime(
    pickerFunction: (orders: OrderDTO[]) => number[],
  ): Observable<AverageDuration> {
    return this.getOrders().pipe(
      map((orders) => pickerFunction(orders)),
      map((durations) => ArrayHelper.arrayAverage(durations)),
      map((avgDuration) => ({ avgDuration })),
    );
  }

  private getDeliveryDurations(orders: OrderDTO[]): number[] {
    return orders.map(
      (o) =>
        new Date(o.delivery_ended).getTime() -
        new Date(o.delivery_started).getTime(),
    );
  }

  private getPreparationDurations(orders: OrderDTO[]): number[] {
    return orders.map(
      (o) =>
        new Date(o.delivery_started).getTime() -
        new Date(o.created_at).getTime(),
    );
  }
}
