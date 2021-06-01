import { HttpModule, Module } from '@nestjs/common';
import { JiraAnalyticsModule } from './jira-analytics/jira-analytics.module';
import { JiraHttpService } from './jira-http.service';
import { JiraTaskService } from './jira-task.service';
import { SpinalModule } from '../spinal/spinal.module';

@Module({
  imports: [HttpModule, JiraAnalyticsModule, SpinalModule],
  controllers: [],
  providers: [JiraHttpService, JiraTaskService],
  exports: [JiraTaskService],
})
export class JiraModule {}
