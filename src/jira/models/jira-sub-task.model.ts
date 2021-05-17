import { AbstractIssue } from './abstract-issue.model';

export class JiraSubTask extends AbstractIssue {
  constructor(dishName: string) {
    super();
    this.fields.issuetype = { id: '10002' };
    this.fields.labels = ['Plat'];
    this.fields.description = 'Plat  ' + dishName;
    this.fields.summary = dishName;
  }
}
