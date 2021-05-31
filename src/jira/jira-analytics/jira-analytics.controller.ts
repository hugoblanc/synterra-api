import { Body, Controller, Logger, Post } from '@nestjs/common';

@Controller('jira-analytics')
export class JiraAnalyticsController {
  logger = new Logger(JiraAnalyticsController.name);
  @Post()
  handleWebHook(@Body() payload: any) {
    this.logger.log('Jira webhook handled');
    console.log(JSON.stringify(payload));
  }
}
