import { Module } from '@nestjs/common';
import { SpinalModule } from '../../spinal/spinal.module';
import { JiraHttpModule } from '../jira-http/jira-http.module';
import { JiraTaskService } from './jira-task.service';

@Module({
  imports: [SpinalModule, JiraHttpModule],
  providers: [JiraTaskService],
  exports: [JiraTaskService],
})
export class JiraTaskModule {}
