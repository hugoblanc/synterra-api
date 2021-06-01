import { Module } from '@nestjs/common';
import { IssueModule } from '../../spinal/domain/issue/issue.module';
import { JiraAnalyticsController } from './jira-analytics.controller';
import { JiraAnalyticsService } from './jira-analytics.service';

@Module({
  imports: [IssueModule],
  controllers: [JiraAnalyticsController],
  providers: [JiraAnalyticsService],
})
export class JiraAnalyticsModule {}
