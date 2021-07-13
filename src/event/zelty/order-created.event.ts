import { OrderDTO } from '../../zelty/models/order.dto';

export class OrdersCreatedEvent {
  public static readonly EVENT_NAME = 'orders.created';
  constructor(
    public readonly ordersToCreate: OrderDTO[],
    public readonly ordersCreated: OrderDTO[],
  ) {}
}
