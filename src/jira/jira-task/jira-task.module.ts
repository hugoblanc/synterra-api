import { Module } from '@nestjs/common';
import { SpinalModule } from '../../spinal/spinal.module';
import { JiraHttpModule } from '../jira-http/jira-http.module';
import { JiraCommandService } from './jira-command.service';
import { JiraQueryService } from './jira-query.service';
import { JiraTaskService } from './jira-task.service';

@Module({
  imports: [SpinalModule, JiraHttpModule],
  providers: [JiraTaskService, JiraQueryService, JiraCommandService],
  exports: [JiraTaskService],
})
export class JiraTaskModule {}
