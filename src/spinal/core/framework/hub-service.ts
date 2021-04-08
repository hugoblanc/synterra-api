import { Observable } from 'rxjs';
export interface HubService {
  readonly NODE_NAME: string;
  load: () => Observable<any>;
  store: (node: any) => Observable<any>;
}
