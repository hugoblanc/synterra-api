import { HttpModule, Module } from '@nestjs/common';
import { JiraAnalyticsModule } from './jira-analytics/jira-analytics.module';
import { JiraHttpService } from './jira-http.service';
import { JiraTaskService } from './jira-task.service';

@Module({
  imports: [HttpModule, JiraAnalyticsModule],
  controllers: [],
  providers: [JiraHttpService, JiraTaskService],
  exports: [JiraTaskService],
})
export class JiraModule {}
