import { BaseEntity } from 'typeorm';

export class AbstractEntity<T> extends BaseEntity {
  constructor(partial: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}
