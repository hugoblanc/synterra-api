import { Module } from '@nestjs/common';
import { JiraModule } from '../../jira/jira.module';
import { TaskCreationService } from './task-creation.service';
import { SpinalModule } from '../../spinal/spinal.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TaskUpdateService } from './task-update.service';
import { OrderModule } from '../../spinal/domain/order/order.module';

@Module({
  imports: [JiraModule, SpinalModule, AnalyticsModule, OrderModule],
  controllers: [],
  providers: [TaskCreationService, TaskUpdateService],
})
export class TaskModule {}
