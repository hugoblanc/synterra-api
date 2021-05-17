import { OrderStatusUpdate } from '../../zelty/models/order-status';

export class OrderStatusUpdateEvent {
  public static readonly EVENT_NAME = 'order-status.update';
  constructor(public readonly update: OrderStatusUpdate) {}
}
