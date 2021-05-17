import { AbstractIssue } from './abstract-issue.model';
export const issue: AbstractIssue = {
  fields: {
    project: {
      id: '10001',
    },
    summary: 'Le Nervous Breakdown',
    issuetype: {
      id: '10001',
    },
    labels: ['bugfix', 'blitz_test'],
    description: 'description',
  },
};
