import { HttpModule, Module } from '@nestjs/common';
import { JiraHttpService } from './jira-http.service';
import { JiraTaskService } from './jira-task.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [JiraHttpService, JiraTaskService],
})
export class JiraModule {}
