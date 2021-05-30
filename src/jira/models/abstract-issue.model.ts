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
  customfield_10011?: string; // epic name
  // assignee: Assignee;
  // priority: Priority;
  customfield_10029?: string; // heure de livraison
  customfield_10030?: string;
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
