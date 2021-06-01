export interface IssueChangelogDTO {
  expand: string;
  id: string;
  self: string;
  key: string;
  changelog: Changelog;
  fields: Fields2;
}

interface Fields2 {
  statuscategorychangedate: string;
  issuetype: Issuetype;
  parent: Parent;
  timespent?: any;
  sprint?: any;
  customfield_10030: string;
  project: Project;
  customfield_10031: string;
  customfield_10032: any[];
  customfield_10033?: any;
  fixVersions: any[];
  customfield_10034?: any;
  aggregatetimespent?: any;
  customfield_10035?: any;
  resolution?: any;
  customfield_10036?: any;
  customfield_10037?: any;
  customfield_10029: string;
  resolutiondate?: any;
  workratio: number;
  lastViewed: string;
  issuerestriction: Issuerestriction;
  watches: Watches;
  created: string;
  customfield_10020?: any;
  customfield_10021?: any;
  epic?: any;
  customfield_10022?: any;
  priority: Priority;
  customfield_10023?: any;
  customfield_10024?: any;
  customfield_10025?: any;
  labels: string[];
  customfield_10016?: any;
  customfield_10017?: any;
  customfield_10018: Customfield10018;
  customfield_10019: string;
  timeestimate: number;
  aggregatetimeoriginalestimate: number;
  versions: any[];
  issuelinks: any[];
  assignee?: any;
  updated: string;
  status: Status;
  components: Component[];
  timeoriginalestimate: number;
  description?: any;
  customfield_10010?: any;
  customfield_10014?: any;
  timetracking: Timetracking;
  customfield_10015?: any;
  customfield_10005?: any;
  customfield_10006?: any;
  security?: any;
  customfield_10007?: any;
  customfield_10008?: any;
  aggregatetimeestimate: number;
  attachment: any[];
  customfield_10009?: any;
  flagged: boolean;
  summary: string;
  creator: Author;
  subtasks: any[];
  reporter: Author;
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
  comment: Comment;
  votes: Votes;
  worklog: Worklog;
}

interface Worklog {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: any[];
}

interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

interface Comment {
  comments: any[];
  self: string;
  maxResults: number;
  total: number;
  startAt: number;
}

interface Aggregateprogress {
  progress: number;
  total: number;
  percent: number;
}

interface Timetracking {
  originalEstimate: string;
  remainingEstimate: string;
  originalEstimateSeconds: number;
  remainingEstimateSeconds: number;
}

interface Component {
  self: string;
  id: string;
  name: string;
  description: string;
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

interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

interface Issuerestriction {
  issuerestrictions: Issuerestrictions;
  shouldDisplay: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Issuerestrictions {}

interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: AvatarUrls;
}

interface Parent {
  id: string;
  key: string;
  self: string;
  fields: Fields;
}

interface Fields {
  summary: string;
  status: Status;
  priority: Priority;
  issuetype: Issuetype;
}

interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
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

interface Changelog {
  startAt: number;
  maxResults: number;
  total: number;
  histories: History[];
}

interface History {
  id: string;
  author: Author;
  created: string;
  items: Item[];
}

interface Item {
  field: string;
  fieldtype: string;
  fieldId?: string;
  from?: string;
  fromString?: string;
  to?: string;
  toString: string;
}

interface Author {
  self: string;
  accountId: string;
  emailAddress: string;
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
