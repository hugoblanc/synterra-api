import { DishOrder, OrderDTO } from 'src/zelty/models/order.dto';
import { calculateMaxDeliveryTime } from '../../coordination/order-timing/order-timing.utils';
import { AbstractIssue } from './abstract-issue.model';
import { CreatePriority } from './jira-issue-created.dto';

export class JiraSubTask extends AbstractIssue {
  constructor(
    dish: DishOrder,
    parentOrder: OrderDTO,
    priority?: CreatePriority,
  ) {
    super();
    this.fields.issuetype = { id: '10002' };
    this.fields.labels = ['Plat'];
    this.fields.customfield_10029 = parentOrder.due_date;
    this.fields.customfield_10030 = calculateMaxDeliveryTime(
      parentOrder.due_date,
    );
    this.fields.priority = priority;
    this.fields.description = parentOrder.delivery_address?.formatted_address;
    this.fields.summary = dish.name;
  }
}
