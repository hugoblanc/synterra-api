import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZeltyHttpService } from '../core/zelty-http.service';
import { Order, OrderReponse } from '../models/order';

@Injectable()
export class OrderService {
  private static BASE_RESOURCES = 'orders';

  constructor(private readonly http: ZeltyHttpService) {}

  getOrders(): Observable<Order[]> {
    return this.http
      .get<OrderReponse>(OrderService.BASE_RESOURCES)
      .pipe(map((reponse) => reponse.orders));
  }
}
