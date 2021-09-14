import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { concat, EMPTY, firstValueFrom, forkJoin, lastValueFrom } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { MainTaskCreatedEvent } from '../../event/jira/main-task-created.event';
import { SubTasksCreatedEvent } from '../../event/jira/sub-tasks-created.event';
import { OrdersCreatedEvent } from '../../event/zelty/order-created.event';
import { IssueFactory } from '../../jira/jira-task/issue.factory';
import { JiraTaskService } from '../../jira/jira-task/jira-task.service';
import { DishSpinalDomainService } from '../../spinal/domain/dish-spinal/dish-spinal-domain.service';
import { DeterministicPlanningAggregate } from '../../spinal/domain/order/aggregate/deterministic-planning.aggregate';
import { OrderDTO } from '../../zelty/models/order.dto';
import { SynterraAnalyticsService } from '../analytics/synterra-analytics.service';

@Injectable()
export class TaskCreationService {
  private logger = new Logger(TaskCreationService.name);

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
    const epic$ = this.jiraTaskService.getOrCreateEpic(order);
    const mainTask$ = this.createMainTask(factory);

    const createJiraObjects$ = forkJoin([epic$, mainTask$]).pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tap(([epic, issueCreatedDto]) => {
        factory.addParentId(issueCreatedDto.id);
        this.logger.log('Parent id correctly added' + issueCreatedDto.id);
      }),
      mergeMap(([epic, issueCreatedDto]) =>
        this.jiraTaskService.moveTaskIntoEpic(epic.id, issueCreatedDto),
      ),
      mergeMap(() => this.createSubTasks(factory)),
      catchError((error) => {
        this.logger.error(error);
        return EMPTY;
      }),
    );

    return createJiraObjects$;
  }

  private createMainTask(factory: IssueFactory) {
    const mainTask = factory.task;
    this.logger.log('Main creation ' + mainTask.fields.summary);
    return this.jiraTaskService.postMainTask(mainTask).pipe(
      tap((issueCreated) => {
        this.eventEmitter.emit(
          MainTaskCreatedEvent.EVENT_NAME,
          new MainTaskCreatedEvent(issueCreated.id, factory),
        );
      }),
    );
  }

  private createSubTasks(factory: IssueFactory) {
    const subTasks = factory.subTasks;
    return this.jiraTaskService
      .createSubTasks(subTasks)
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
