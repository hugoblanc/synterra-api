import { calculateMaxDeliveryTime } from '../../coordination/order-timing/order-timing.utils';
import { OrderDTO } from '../../zelty/models/order.dto';
import { AbstractIssue } from './abstract-issue.model';
export class JiraTask extends AbstractIssue {
  constructor(order: OrderDTO) {
    super();
    this.fields.issuetype = { id: '10001' };
    this.fields.labels = [order.delivery_address?.city.replace(/\s+/g, '')];
    this.fields.customfield_10029 = order.due_date;
    this.fields.customfield_10030 = calculateMaxDeliveryTime(
      order.due_date,
      order.delivery_address?.city,
    );
    this.fields.description = '';
    if (order.comment) {
      this.fields.description += 'Commentaire: ' + order.comment + '  \n';
    }
    this.fields.description = order.delivery_address?.formatted_address;
    this.fields.summary = 'Commande ' + order.ref;
  }

  public addMissingInformations(
    maxPreparationStartDate: string,
    components: { id: string }[],
  ): void {
    this.fields.customfield_10031 = maxPreparationStartDate;
    this.fields.components = components;
  }
}
