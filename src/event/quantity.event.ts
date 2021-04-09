import { QuantityEntity } from '../domain/quantity/entities/quantity.entity';
export class QuantityCreatedEvent {
  public static readonly EVENT_NAME = 'quantity.created';

  constructor(public readonly quantity: QuantityEntity) {}
}
