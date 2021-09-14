import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { DailyAvgUpdatedEvent } from '../../event/analytics/daily-avg-updated.event';
import { SubTasksUpdatedEvent } from '../../event/jira/sub-tasks-updated.event';
import { JiraTaskService } from '../../jira/jira-task/jira-task.service';
import { DishSpinalDomainService } from '../../spinal/domain/dish-spinal/dish-spinal-domain.service';
import { DeterministicPlanningAggregate } from '../../spinal/domain/order/aggregate/deterministic-planning.aggregate';
import { OpenOrdersHubRepository } from '../../spinal/domain/order/open-order-hub.repository';
import { SynterraAnalyticsService } from '../analytics/synterra-analytics.service';
import { OrderUpdateFinder } from './aggregate/order-update-finder';

@Injectable()
export class TaskUpdateService {
  private logger = new Logger(TaskUpdateService.name);

  constructor(
    private readonly dishSpinalService: DishSpinalDomainService,
    private readonly openOrderRepository: OpenOrdersHubRepository,
    private readonly jiraTaskService: JiraTaskService,
    private readonly eventEmitter: EventEmitter2,
    private readonly synterraAnalyticsService: SynterraAnalyticsService,
  ) {}

  @OnEvent(DailyAvgUpdatedEvent.EVENT_NAME)
  async realtimeUpdate(event: DailyAvgUpdatedEvent) {
    const mixedAverage = await firstValueFrom(
      this.synterraAnalyticsService.getMixedAverage(),
    );
    const dishes = await firstValueFrom(this.dishSpinalService.findAll());
    const openOrdersDTO = await firstValueFrom(
      this.openOrderRepository.findAll(),
    );

    const planning = new DeterministicPlanningAggregate(
      [],
      openOrdersDTO,
      dishes,
    );
    planning.fillPlanning(mixedAverage);

    const ordersCreated = planning.eOrdersCreated;

    const orderUpdateFinder = new OrderUpdateFinder(ordersCreated, planning);
    const updates = orderUpdateFinder.findUpdates();
    if (updates.length === 0) {
      return;
    }
    await lastValueFrom(this.jiraTaskService.updateSubTasks(updates));
    const subTaskUpdatedEvent = new SubTasksUpdatedEvent(updates);

    this.eventEmitter.emit(
      SubTasksUpdatedEvent.EVENT_NAME,
      subTaskUpdatedEvent,
    );
  }
}
