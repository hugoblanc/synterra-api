import { AbstractIssue } from './abstract-issue.model';
export class JiraEpic extends AbstractIssue {
  constructor(summary: string) {
    super();
    this.fields.issuetype = { id: '10000' };
    this.fields.labels = ['Service'];
    this.fields.description = summary;
    this.fields.summary = summary;
    this.fields.customfield_10011 = summary;
  }
}
