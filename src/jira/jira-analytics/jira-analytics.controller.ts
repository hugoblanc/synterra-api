import { Body, Controller, Logger, Post } from '@nestjs/common';
import { JiraAnalyticsService } from './jira-analytics.service';
import { JiraWebhookEvent } from './models/jira-webhook.model';

@Controller('jira-analytics')
export class JiraAnalyticsController {
  logger = new Logger(JiraAnalyticsController.name);

  constructor(private readonly jiraAnalyticsService: JiraAnalyticsService) {}

  @Post()
  handleWebHook(@Body() payload: JiraWebhookEvent) {
    this.logger.log('Jira webhook handled');
    this.jiraAnalyticsService.handleWebhook(payload);
  }
}
