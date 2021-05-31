import { OrderDTO } from 'src/zelty/models/order.dto';
import { calculateMaxDeliveryTime } from '../../coordination/order-timing/order-timing.utils';
import { AbstractIssue } from './abstract-issue.model';
export class JiraTask extends AbstractIssue {
  constructor(order: OrderDTO) {
    super();
    this.fields.issuetype = { id: '10001' };
    this.fields.labels = [order.delivery_address?.city];
    this.fields.customfield_10029 = order.due_date;
    this.fields.customfield_10030 = calculateMaxDeliveryTime(
      order.due_date,
      order.delivery_address?.city,
    );
    this.fields.description = order.delivery_address?.formatted_address;
    this.fields.summary = 'Commande ' + order.ref;
  }
}
