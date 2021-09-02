import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  concat,
  EMPTY,
  firstValueFrom,
  forkJoin,
  lastValueFrom,
  merge,
  Observable,
} from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { MainTaskCreatedEvent } from '../../event/jira/main-task-created.event';
import { SubTasksCreatedEvent } from '../../event/jira/sub-tasks-created.event';
import { OrdersCreatedEvent } from '../../event/zelty/order-created.event';
import { IssueFactory } from '../../jira/jira-task/issue.factory';
import { createSummaryFromDate } from '../../jira/jira-task/jira-summary.utils';
import { JiraTaskService } from '../../jira/jira-task/jira-task.service';
import { JiraEpic } from '../../jira/models/jira-epic.model';
import { IssueCreatedDto } from '../../jira/models/jira-issue-created.dto';
import { DishSpinalDomainService } from '../../spinal/domain/dish-spinal/dish-spinal-domain.service';
import { DeterministicPlanningAggregate } from '../../spinal/domain/order/aggregate/deterministic-planning.aggregate';
import { OrderDTO } from '../../zelty/models/order.dto';
import { SynterraAnalyticsService } from '../analytics/synterra-analytics.service';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  constructor(
    private readonly jiraTaskService: JiraTaskService,
    private readonly dishSpinalService: DishSpinalDomainService,
    private readonly synterraAnalyticsService: SynterraAnalyticsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(OrdersCreatedEvent.EVENT_NAME)
  async createTask(createdEvent: OrdersCreatedEvent) {
    const dishes = await firstValueFrom(this.dishSpinalService.findAll());
    const pastAverage = await firstValueFrom(
      this.synterraAnalyticsService.getPastAverage(),
    );
    const planning = new DeterministicPlanningAggregate(
      createdEvent.ordersToCreate,
      createdEvent.ordersCreated,
      dishes,
    );

    planning.fillPlanning(pastAverage);

    const orderToCreate = planning.eOrdersToCreate;
    const createJiraObjects$ = orderToCreate.map((order) => {
      const factory = new IssueFactory(order, planning);
      return this.createJiraObjects(factory, order);
    });

    if (createJiraObjects$.length > 0) {
      await lastValueFrom(concat(...createJiraObjects$));
    }
  }

  private createJiraObjects(factory: IssueFactory, order: OrderDTO) {
    const epic$ = this.getOrCreateEpic(order);
    const mainTask$ = this.createMainTask(factory);

    const createJiraObjects$ = forkJoin([epic$, mainTask$]).pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tap(([epic, issueCreatedDto]) => {
        factory.addParentId(issueCreatedDto.id);
        this.logger.log('Parent id correctly added' + issueCreatedDto.id);
      }),
      mergeMap(([epic, issueCreatedDto]) =>
        this.moveMainTaskIntoEpic(epic, issueCreatedDto),
      ),
      mergeMap(() => this.createSubTasks(factory)),
      catchError((error) => {
        this.logger.error(error);
        return EMPTY;
      }),
    );

    return createJiraObjects$;
  }

  private getOrCreateEpic(order: OrderDTO) {
    const getExisting$ = this.getEpicIfExisting(order);
    const createIfNotExist$ = this.createEpicIfNotExisting(order);

    return merge(getExisting$, createIfNotExist$);
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

  private createEpicIfNotExisting(order: OrderDTO) {
    return this.isEpicAlreadyExisting(order).pipe(
      filter((isExisting) => !isExisting),
      mergeMap(() => this.createEpic(order)),
      mergeMap((issueCreatedDto) => {
        this.logger.log('Epic correctly created' + issueCreatedDto.id);
        return this.jiraTaskService.getById(issueCreatedDto.id);
      }),
    );
  }

  private isEpicAlreadyExisting(order: OrderDTO): Observable<boolean> {
    return this.searchEpicByDueDate(order.due_date).pipe(
      map((searchResults) => searchResults.total > 0),
    );
  }

  private searchEpicByDueDate(dueDate: string) {
    const summary = createSummaryFromDate(dueDate);
    this.logger.log('Epic summary ' + summary);
    return this.jiraTaskService.searchBySummary(summary);
  }

  private createEpic(order: OrderDTO) {
    const epicSummary = createSummaryFromDate(order.due_date);
    const epic = new JiraEpic(epicSummary);
    return this.jiraTaskService.postEpic(epic);
  }

  private createMainTask(factory: IssueFactory) {
    const mainTask = factory.task;
    this.logger.log('Main creation ' + mainTask.fields.summary);
    return this.jiraTaskService.postMainTask(mainTask).pipe(
      tap((issueCreated) => {
        this.logger.log(
          'Main task correctly created ready to send event' + issueCreated.id,
        );
        this.eventEmitter.emit(
          MainTaskCreatedEvent.EVENT_NAME,
          new MainTaskCreatedEvent(issueCreated.id, factory),
        );
      }),
    );
  }

  private moveMainTaskIntoEpic(epic, issueCreated: IssueCreatedDto) {
    this.logger.log(
      'Moving task into epic :' + epic.id + ' mainTask: ' + issueCreated.id,
    );
    return this.jiraTaskService.moveTaskIntoEpic(epic.id, issueCreated.id);
  }

  private createSubTasks(factory: IssueFactory) {
    const subTasks = factory.subTasks;
    return this.jiraTaskService
      .postSubTasks(subTasks)
      .pipe(
        tap((subTasks) =>
          this.eventEmitter.emit(
            SubTasksCreatedEvent.EVENT_NAME,
            new SubTasksCreatedEvent(subTasks, factory),
          ),
        ),
      );
  }
}
