import { Injectable } from '@nestjs/common';
import { forkJoin, Observable } from 'rxjs';
import { JiraHttpService } from '../jira-http/jira-http.service';
import { JiraEpic } from '../models/jira-epic.model';
import { IssueCreatedDto } from '../models/jira-issue-created.dto';
import { JiraSubTask } from '../models/jira-sub-task.model';
import { JiraTask } from '../models/jira-task.model';
import { SubTaskUpdateDTO } from '../models/sub-task-update.model';

@Injectable()
export class JiraCommandService {
  constructor(private readonly http: JiraHttpService) {}

  updateTaskParent(epicId: string, taskId: string): Observable<void> {
    return this.http.post<void>(`agile/1.0/epic/${epicId}/issue`, {
      issues: [taskId],
    });
  }

  updateSubTask(update: SubTaskUpdateDTO, issueId: string): Observable<void> {
    return this.http.put<void>(`api/2/issue/${issueId}`, update);
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
