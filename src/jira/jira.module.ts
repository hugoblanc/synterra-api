import { Module } from '@nestjs/common';
import { JiraAnalyticsModule } from './jira-analytics/jira-analytics.module';
import { JiraTaskModule } from './jira-task/jira-task.module';

@Module({
  imports: [JiraAnalyticsModule, JiraTaskModule],
  controllers: [],
  providers: [],
  exports: [JiraTaskModule],
})
export class JiraModule {}
