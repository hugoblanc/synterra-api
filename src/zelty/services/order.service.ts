import { Injectable } from '@nestjs/common';
import { format, subDays } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZeltyHttpService } from '../core/zelty-http.service';
import { Order, OrderReponse } from '../models/order';

@Injectable()
export class OrderService {
  private static BASE_RESOURCES = 'orders';

  constructor(private readonly http: ZeltyHttpService) {}

  getOrders(maxDate?: string): Observable<Order[]> {
    const from = maxDate ?? '2021-04-04';
    const to = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    console.log(from, to);

    return this.http
      .get<OrderReponse>(OrderService.BASE_RESOURCES, {
        params: { from, to },
      })
      .pipe(map((reponse) => reponse.orders));
  }
}
