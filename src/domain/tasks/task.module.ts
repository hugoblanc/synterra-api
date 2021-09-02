import { Module } from '@nestjs/common';
import { JiraModule } from '../../jira/jira.module';
import { TaskService } from './task.service';
import { SpinalModule } from '../../spinal/spinal.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [JiraModule, SpinalModule, AnalyticsModule],
  controllers: [],
  providers: [TaskService],
})
export class TaskModule {}
