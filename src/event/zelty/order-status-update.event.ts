import { OrderStatusUpdate } from 'src/zelty/models/order-status';

export class OrderStatusUpdateEvent {
  public static readonly EVENT_NAME = 'order-status.update';
  constructor(public readonly update: OrderStatusUpdate) {}
}
