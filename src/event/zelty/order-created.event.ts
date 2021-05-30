import { OrderDTO } from '../../zelty/models/order.dto';

export class OrderCreatedEvent {
  public static readonly EVENT_NAME = 'orders.created';
  constructor(public readonly orders: OrderDTO[]) {}
}
