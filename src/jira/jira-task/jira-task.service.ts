import { Injectable } from '@nestjs/common';
import { forkJoin, Observable } from 'rxjs';
import { JiraHttpService } from '../jira-http/jira-http.service';
import { JiraEpic } from '../models/jira-epic.model';
import { IssueCreatedDto } from '../models/jira-issue-created.dto';
import { JiraSearchResults } from '../models/jira-search-results.dto';
import { JiraSubTask } from '../models/jira-sub-task.model';
import { JiraTask } from '../models/jira-task.model';

@Injectable()
export class JiraTaskService {
  constructor(private readonly http: JiraHttpService) {}

  getById(id: string) {
    return this.http.get('agile/1.0/issue/' + id);
  }

  searchBySummary(summary: string): Observable<JiraSearchResults> {
    const jql = `summary~"${summary}"`;
    return this.http.get<JiraSearchResults>('api/3/search?jql=' + jql, {});
  }

  moveTaskIntoEpic(epicId: string, taskId: string): Observable<void> {
    return this.http.post<void>(`agile/1.0/epic/${epicId}/issue`, {
      issues: [taskId],
    });
  }

  postEpic(epic: JiraEpic): Observable<IssueCreatedDto> {
    return this.http.post<IssueCreatedDto>('api/2/issue', epic);
  }

  postMainTask(mainTask: JiraTask): Observable<IssueCreatedDto> {
    return this.http.post<IssueCreatedDto>('api/2/issue', mainTask);
  }

  postSubTasks(subTasks: JiraSubTask[]): Observable<IssueCreatedDto[]> {
    const postSubTasks$ = subTasks.map((sub) =>
      this.http.post('api/2/issue', sub),
    );
    return forkJoin(postSubTasks$);
  }
}
