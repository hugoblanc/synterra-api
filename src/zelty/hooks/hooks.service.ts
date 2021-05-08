import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { OrderStatusUpdate } from '../models/order-status';
import { OrderStatusUpdateEvent } from '../../event/zelty/order-status-update.event';

@Injectable()
export class HooksService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  updateOrderStatus(update: OrderStatusUpdate) {
    const updateEvent = new OrderStatusUpdateEvent(update);
    this.eventEmitter.emit(OrderStatusUpdateEvent.EVENT_NAME, updateEvent);
  }
}
