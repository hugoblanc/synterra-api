export interface JiraWebhookEvent {
  timestamp: number;
  webhookEvent: string;
  issue_event_type_name: string;
  user: User;
  issue: Issue;
  changelog: Changelog;
}

interface Changelog {
  id: string;
  items: Item[];
}

interface Item {
  field: string;
  fieldtype: string;
  fieldId: string;
  from: string;
  fromString: string;
  to: string;
  toString: string;
}

interface Issue {
  id: string;
  self: string;
  key: string;
  fields: Fields;
}

interface Fields {
  statuscategorychangedate: string;
  issuetype: Issuetype;
  timespent?: any;
  customfield_10030?: any;
  project: Project;
  customfield_10031?: any;
  customfield_10032: any[];
  fixVersions: any[];
  customfield_10033?: any;
  customfield_10034?: any;
  aggregatetimespent?: any;
  customfield_10035?: any;
  resolution?: any;
  customfield_10036?: any;
  customfield_10037?: any;
  customfield_10029?: any;
  resolutiondate?: any;
  workratio: number;
  watches: Watches;
  issuerestriction: Issuerestriction;
  lastViewed?: any;
  created: string;
  customfield_10020?: any;
  customfield_10021?: any;
  customfield_10022?: any;
  customfield_10023?: any;
  priority: Priority;
  customfield_10024?: any;
  customfield_10025?: any;
  labels: string[];
  customfield_10016?: any;
  customfield_10017?: any;
  customfield_10018: Customfield10018;
  customfield_10019: string;
  aggregatetimeoriginalestimate?: any;
  timeestimate?: any;
  versions: any[];
  issuelinks: any[];
  assignee?: any;
  updated: string;
  status: Status;
  components: any[];
  timeoriginalestimate?: any;
  description: string;
  customfield_10010?: any;
  customfield_10014?: any;
  // timetracking: Issuerestrictions;
  customfield_10015?: any;
  customfield_10005?: any;
  customfield_10006?: any;
  customfield_10007?: any;
  security?: any;
  customfield_10008?: any;
  customfield_10009?: any;
  attachment: any[];
  aggregatetimeestimate?: any;
  summary: string;
  creator: User;
  subtasks: any[];
  reporter: User;
  aggregateprogress: Aggregateprogress;
  customfield_10000: string;
  customfield_10001?: any;
  customfield_10002?: any;
  customfield_10003?: any;
  customfield_10004?: any;
  customfield_10038?: any;
  customfield_10039?: any;
  environment?: any;
  duedate?: any;
  progress: Aggregateprogress;
  votes: Votes;
}

interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

interface Aggregateprogress {
  progress: number;
  total: number;
}

interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

interface Customfield10018 {
  hasEpicLinkFieldDependency: boolean;
  showField: boolean;
  nonEditableReason: NonEditableReason;
}

interface NonEditableReason {
  reason: string;
  message: string;
}

interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

interface Issuerestriction {
  // issuerestrictions: Issuerestrictions;
  shouldDisplay: boolean;
}

// interface Issuerestrictions {}

interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: AvatarUrls;
}

interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  hierarchyLevel: number;
}

interface User {
  self: string;
  accountId: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}
