export enum OrderStatusEnum {
  OPENED = 'opened',
  CANCELLED = 'cancelled',
  ENDED = 'ended',
}

export enum DeliveryStatusEnum {
  PENDING = 'pending',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
}

export interface OrderStatusUpdate {
  id: number;
  uuid: string;
  remote_id: string;
  status: OrderStatusEnum;
  delivery_status: DeliveryStatusEnum;
}
