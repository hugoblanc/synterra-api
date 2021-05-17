import { OrderDTO } from '../../zelty/models/order';

export class OrderCreatedEvent {
  public static readonly EVENT_NAME = 'order.created';
  constructor(public readonly order: OrderDTO) {}
}
