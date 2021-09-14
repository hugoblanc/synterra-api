import { Module } from '@nestjs/common';
import { JiraModule } from '../../jira/jira.module';
import { TaskCreationService } from './task-creation.service';
import { SpinalModule } from '../../spinal/spinal.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TaskUpdateService } from './task-update.service';

@Module({
  imports: [JiraModule, SpinalModule, AnalyticsModule],
  controllers: [],
  providers: [TaskCreationService, TaskUpdateService],
})
export class TaskModule {}
