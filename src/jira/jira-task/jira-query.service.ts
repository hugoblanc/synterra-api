import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JiraHttpService } from '../jira-http/jira-http.service';
import { JiraSearchResults } from '../models/jira-search-results.dto';

@Injectable()
export class JiraQueryService {
  constructor(private readonly http: JiraHttpService) {}

  getById(id: string) {
    return this.http.get('agile/1.0/issue/' + id);
  }

  searchBySummary(summary: string): Observable<JiraSearchResults> {
    const jql = `summary~"${summary}"`;
    return this.http.get<JiraSearchResults>('api/3/search?jql=' + jql, {});
  }
}
