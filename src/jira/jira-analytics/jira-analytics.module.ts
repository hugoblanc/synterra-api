import { Module } from '@nestjs/common';
import { IssueModule } from '../../spinal/domain/issue/issue.module';
import { JiraTaskModule } from '../jira-task/jira-task.module';
import { JiraAnalyticsController } from './jira-analytics.controller';
import { JiraAnalyticsService } from './jira-analytics.service';

@Module({
  imports: [JiraTaskModule, IssueModule],
  controllers: [JiraAnalyticsController],
  providers: [JiraAnalyticsService],
})
export class JiraAnalyticsModule {}
