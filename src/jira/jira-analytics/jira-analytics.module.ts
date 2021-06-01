import { Module } from '@nestjs/common';
import { SpinalModule } from '../../spinal/spinal.module';
import { JiraAnalyticsController } from './jira-analytics.controller';
import { JiraAnalyticsService } from './jira-analytics.service';

@Module({
  imports: [SpinalModule],
  controllers: [JiraAnalyticsController],
  providers: [JiraAnalyticsService],
})
export class JiraAnalyticsModule {}
