import { Logger } from '@nestjs/common';
import {
  DishOrderEnhance,
  OrderEnhanced,
} from '../../domain/tasks/models/task-order';
import { Slot } from '../../spinal/domain/order/aggregate/deterministic-planning.aggregate';
import { AbstractIssue } from './abstract-issue.model';

export class JiraSubTask extends AbstractIssue {
  private _dishId: number;
  get dishId(): number {
    return this._dishId;
  }

  constructor(dish: DishOrderEnhance, parentOrder: OrderEnhanced, slot: Slot) {
    super();
    this._dishId = dish.id;
    this.fields.issuetype = { id: '10002' };
    this.fields.labels = [
      'Plat',
      parentOrder.delivery_address?.city.replace(/\s+/g, ''),
    ];
    this.fields.summary = dish.name;
    this.fields.customfield_10029 = parentOrder.due_date;
    this.fields.priority = dish.priority;
    if (dish.component) {
      this.fields.components = [dish.component];
    }

    this.fields.description =
      dish.contents.map((c) => `${c.quantity} ${c.name}`).join(' \n') ?? '';

    this.fields.customfield_10030 = parentOrder.maxDeliveryDate.toISOString();

    this.setupTimeOffset(slot);
  }

  private setupTimeOffset(slot: Slot) {
    if (!slot) {
      const logger = new Logger(JiraSubTask.name);
      logger.warn('No slot for ' + this.fields.summary);
      return;
    }

    const maxPreparationStartDate = slot.startDate?.toISOString();

    this.fields.customfield_10031 = maxPreparationStartDate;
  }
}
