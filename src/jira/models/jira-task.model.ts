import { AbstractIssue } from './abstract-issue.model';
export class JiraTask extends AbstractIssue {
  constructor(orderRef: number) {
    super();
    this.fields.issuetype = { id: '10001' };
    this.fields.labels = ['Menu'];
    this.fields.description = 'Commande références ' + orderRef;
    this.fields.summary = 'Commande ' + orderRef;
  }
}
