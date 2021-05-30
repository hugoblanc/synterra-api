import { OrderDTO } from 'src/zelty/models/order.dto';
import { calculateMaxDeliveryTime } from '../../coordination/order-timing/order-timing.utils';
import { AbstractIssue } from './abstract-issue.model';

export class JiraSubTask extends AbstractIssue {
  constructor(dishName: string, parentOrder: OrderDTO) {
    super();
    this.fields.issuetype = { id: '10002' };
    this.fields.labels = ['Plat'];
    this.fields.customfield_10029 = parentOrder.due_date;
    this.fields.customfield_10030 = calculateMaxDeliveryTime(
      parentOrder.due_date,
    );
    this.fields.description = parentOrder.delivery_address?.formatted_address;
    this.fields.summary = dishName;
  }
}
