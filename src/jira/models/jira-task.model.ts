import { OrderEnhanced } from '../../domain/tasks/models/task-order';
import { AbstractIssue } from './abstract-issue.model';
export class JiraTask extends AbstractIssue {
  constructor(order: OrderEnhanced) {
    super();
    this.fields.issuetype = { id: '10001' };
    this.fields.labels = [order.delivery_address?.city.replace(/\s+/g, '')];
    this.fields.customfield_10029 = order.due_date;
    this.fields.customfield_10030 = order.maxDeliveryDate.toISOString();
    this.fields.description = '';
    if (order.comment) {
      this.fields.description += 'Commentaire: ' + order.comment + '  \n';
    }
    this.fields.description += order.delivery_address?.formatted_address;
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
