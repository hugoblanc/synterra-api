import { Injectable, Logger } from '@nestjs/common';
import { format, subDays } from 'date-fns';
import { concat, defer, EMPTY, Observable, of, tap } from 'rxjs';
import { catchError, map, mergeMap, retryWhen } from 'rxjs/operators';
import { genericRetryStrategy } from '../../core/rxjs/generic-retry-strategy';
import { addUniqueIdOnDishes } from '../core/add-id-on-dish.utils';
import { ZeltyHttpService } from '../core/zelty-http.service';
import { ZeltyPage } from '../core/zelty-page';
import { OrderDTO, OrderResponse } from '../models/order.dto';

@Injectable()
export class OrderService {
  private static BASE_RESOURCES = 'orders';
  private static MAX_RESULT = 200;
  private logger = new Logger(OrderService.name);

  constructor(private readonly http: ZeltyHttpService) {}

  getOpenOrders(): Observable<OrderDTO[]> {
    const opened = 1;
    const expand = 'delivery_address';
    return this.http
      .get<OrderResponse>(OrderService.BASE_RESOURCES, {
        params: { opened, expand },
      })
      .pipe(
        map((response) => response.orders),
        tap((orders) => orders.forEach((order) => addUniqueIdOnDishes(order))),
      );
  }

  // getOpenOrders(): Observable<OrderDTO[]> {
  //   return of(orderMocke as OrderResponse).pipe(map((order) => order.orders));
  // }

  getAllOrders(max?: string): Observable<OrderDTO[]> {
    const getPage = (page?: number) =>
      defer(() => this.getOrders(page, max)).pipe(
        retryWhen(
          genericRetryStrategy({
            scalingDuration: 2000,
            excludedStatusCodes: [423, 425, 429, 502, 503],
          }),
        ),
        catchError((error) => of(error)),
        mergeMap(({ items, offset }) => {
          const items$ = of(items);
          const next$ = offset >= 0 ? getPage(offset) : EMPTY;
          return concat(items$, next$);
        }),
      );

    return getPage();
  }

  getOrders(offset = 0, maxDate?: string): Observable<ZeltyPage<OrderDTO>> {
    const from = maxDate ?? '2020-04-04';
    const to = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const limit = OrderService.MAX_RESULT;
    const expand = 'delivery_address';

    this.logger.log(`from:${from}, to:${to}, offset:${offset}, limit:${limit}`);

    return this.http
      .get<OrderResponse>(OrderService.BASE_RESOURCES, {
        params: { from, to, offset, limit, expand },
      })
      .pipe(
        map((response) => {
          const items = response.orders;

          const resultLength = response.orders.length;
          const isResultIncomplete = resultLength === limit;
          offset = isResultIncomplete ? offset + resultLength : -1;

          return { offset, items };
        }),
      );
  }

  getOrderById(id: number): Observable<OrderDTO> {
    const expand = 'delivery_address';
    return this.http.get(OrderService.BASE_RESOURCES + '/' + id, {
      params: { expand },
    });
  }
}
