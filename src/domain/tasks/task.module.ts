import { Module } from '@nestjs/common';
import { JiraModule } from '../../jira/jira.module';
import { TaskService } from './task.service';

@Module({
  imports: [JiraModule],
  controllers: [],
  providers: [TaskService],
})
export class TaskModule {}
