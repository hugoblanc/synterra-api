export abstract class AbstractIssue {
  fields: Fields;

  constructor() {
    this.fields = new Fields();
  }
}

export class Fields {
  project: Project;
  summary: string;
  issuetype: Project;
  parent?: Project;
  customfield_10011?: string;
  // assignee: Assignee;
  // priority: Priority;
  labels: string[];
  description: string;
  constructor() {
    this.project = { id: '10001' };
  }
}

// interface Priority {
//   self: string;
//   iconUrl: string;
//   name: string;
//   id: string;
// }

interface Assignee {
  name: string;
}

interface Project {
  id: string;
}
