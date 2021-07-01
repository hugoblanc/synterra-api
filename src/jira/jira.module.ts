import { Module } from '@nestjs/common';
import { JiraTaskModule } from './jira-task/jira-task.module';

@Module({
  imports: [JiraTaskModule],
  controllers: [],
  providers: [],
  exports: [JiraTaskModule],
})
export class JiraModule {}
