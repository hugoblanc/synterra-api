import { subMinutes } from 'date-fns';
import {
  calculateMaxDeliveryTime,
  DishPreparationInformation,
  DishPreparationType,
} from '../../coordination/order-timing/order-timing.utils';
import { DishOrder, OrderDTO } from '../../zelty/models/order.dto';
import { AbstractIssue } from './abstract-issue.model';
import { CreateComponent, CreatePriority } from './jira-issue-created.dto';

export class JiraSubTask extends AbstractIssue {
  constructor(
    dish: DishOrder,
    parentOrder: OrderDTO,
    index: number,
    priority?: CreatePriority,
    preparation?: DishPreparationInformation,
    component?: CreateComponent,
  ) {
    super();
    this.fields.issuetype = { id: '10002' };
    this.fields.labels = ['Plat', parentOrder.delivery_address?.city];
    this.fields.summary = dish.name;
    this.fields.customfield_10029 = parentOrder.due_date;
    this.fields.priority = priority;
    this.fields.components = [component];
    this.fields.description = '';

    this.fields.customfield_10030 = calculateMaxDeliveryTime(
      parentOrder.due_date,
      parentOrder.delivery_address?.city,
    );

    const {
      maxPreparationStartDate,
      durationEstimation,
    } = this.calculTimeOffset(index, preparation);
    this.fields.customfield_10031 = maxPreparationStartDate.toISOString();
    this.fields.timeestimate = durationEstimation * 60;
  }

  private calculTimeOffset(
    index = 0,
    preparation?: DishPreparationInformation,
  ) {
    if (!preparation) {
      return;
    }
    const deliveryDate = new Date(this.fields.customfield_10030);
    let durationEstimation: number;

    if (preparation.preparationType === DishPreparationType.PARALLELIZABLE) {
      durationEstimation = preparation.duration;
    } else {
      durationEstimation = preparation.duration * (index + 1);
    }

    const maxPreparationStartDate = subMinutes(
      deliveryDate,
      durationEstimation,
    );

    return { maxPreparationStartDate, durationEstimation };
  }
}
