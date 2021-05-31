import { Module } from '@nestjs/common';
import { JiraAnalyticsController } from './jira-analytics.controller';
import { JiraAnalyticsService } from './jira-analytics.service';

@Module({
  imports: [],
  controllers: [JiraAnalyticsController],
  providers: [JiraAnalyticsService],
})
export class JiraAnalyticsModule {}
