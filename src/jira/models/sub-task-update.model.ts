import { Fields } from './abstract-issue.model';

export interface SubTaskUpdateDTO {
  id: string;
  fields: Partial<Fields>;
}
