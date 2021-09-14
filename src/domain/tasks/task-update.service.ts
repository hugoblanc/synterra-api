import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DailyAvgUpdatedEvent } from '../../event/analytics/daily-avg-updated.event';

@Injectable()
export class TaskUpdateService {
  private logger = new Logger(TaskUpdateService.name);

  @OnEvent(DailyAvgUpdatedEvent.EVENT_NAME)
  realtimeUpdate(event: DailyAvgUpdatedEvent) {}
}
