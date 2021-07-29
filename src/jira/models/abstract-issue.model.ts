import { CreateComponent, CreatePriority } from './jira-issue-created.dto';

export abstract class AbstractIssue {
  fields: Fields;

  constructor() {
    this.fields = new Fields();
  }

  extactTimingInformation(): TimingInformation {
    const maxPreparationTime = this.fields.customfield_10031;
    const maxDeliveryDate = this.fields.customfield_10030;
    const dueDate = this.fields.customfield_10029;
    return { maxPreparationTime, maxDeliveryDate, dueDate };
  }
}

export interface TimingInformation {
  maxPreparationTime: string;
  maxDeliveryDate: string;
  dueDate: string;
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
  customfield_10030?: string; // heure max départ livraison
  customfield_10031?: string; // heure max début de préparation
  components?: CreateComponent[]; // heure max début de préparation
  timeestimate?: number; // estimation en second
  labels: string[];
  description: string;
  priority: CreatePriority;
  constructor() {
    // TODO uncomment this
    this.project = { id: '10001' };
    // this.project = { id: '10007' };
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
