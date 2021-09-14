import { Injectable, Logger } from '@nestjs/common';
import { concat, filter, map, merge, mergeMap, Observable, tap } from 'rxjs';
import { OrderDTO } from '../../zelty/models/order.dto';
import { SubTaskUpdateDTO } from '../models/sub-task-update.model';
import { JiraEpic } from '../models/jira-epic.model';
import { IssueCreatedDto } from '../models/jira-issue-created.dto';
import { JiraSubTask } from '../models/jira-sub-task.model';
import { JiraTask } from '../models/jira-task.model';
import { JiraCommandService } from './jira-command.service';
import { JiraQueryService } from './jira-query.service';
import { createSummaryFromDate } from './jira-summary.utils';

@Injectable()
export class JiraTaskService {
  logger = new Logger(JiraTaskService.name);

  constructor(
    private readonly queryService: JiraQueryService,
    private readonly commandService: JiraCommandService,
  ) {}

  public getOrCreateEpic(order: OrderDTO) {
    const getExisting$ = this.getEpicIfExisting(order);
    const createIfNotExist$ = this.createEpicIfNotExisting(order);
    return merge(getExisting$, createIfNotExist$);
  }

  public moveTaskIntoEpic(epic, issueCreated: IssueCreatedDto) {
    this.logger.log(
      'Moving task into epic :' + epic.id + ' mainTask: ' + issueCreated.id,
    );
    return this.commandService.updateTaskParent(epic, issueCreated.id);
  }

  public createMainTask(mainTask: JiraTask) {
    return this.commandService.postMainTask(mainTask).pipe(
      tap((issueCreated) => {
        this.logger.log(
          'Main task correctly created ready to send event' + issueCreated.id,
        );
      }),
    );
  }

  public createSubTasks(subTasks: JiraSubTask[]) {
    return this.commandService.postSubTasks(subTasks);
  }

  public updateSubTasks(subTasksUpdates: SubTaskUpdateDTO[]) {
    const updates$ = subTasksUpdates.map((subTaskUpdate) =>
      this.commandService.updateSubTask(subTaskUpdate, subTaskUpdate.id),
    );
    return concat(...updates$);
  }

  private getEpicIfExisting(order: OrderDTO) {
    return this.searchEpicByDueDate(order.due_date).pipe(
      filter((searchResults) => searchResults.total > 0),
      map((searchResults) => {
        this.logger.log('Epic is already existing: ' + searchResults.total);
        if (searchResults.total > 1) {
          this.logger.warn(
            'Domain error: More than one epic find for a specific summary',
          );
        }
        return searchResults.issues[0];
      }),
    );
  }

  private searchEpicByDueDate(dueDate: string) {
    const summary = createSummaryFromDate(dueDate);
    this.logger.log('Epic summary ' + summary);
    return this.queryService.searchBySummary(summary);
  }

  private createEpicIfNotExisting(order: OrderDTO) {
    return this.isEpicAlreadyExisting(order).pipe(
      filter((isExisting) => !isExisting),
      mergeMap(() => this.createEpic(order)),
      mergeMap((issueCreatedDto) => {
        this.logger.log('Epic correctly created' + issueCreatedDto.id);
        return this.queryService.getById(issueCreatedDto.id);
      }),
    );
  }

  private createEpic(order: OrderDTO) {
    const epicSummary = createSummaryFromDate(order.due_date);
    const epic = new JiraEpic(epicSummary);
    return this.commandService.postEpic(epic);
  }

  private isEpicAlreadyExisting(order: OrderDTO): Observable<boolean> {
    return this.searchEpicByDueDate(order.due_date).pipe(
      map((searchResults) => searchResults.total > 0),
    );
  }
}
