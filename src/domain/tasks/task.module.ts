import { Module } from '@nestjs/common';
import { JiraModule } from '../../jira/jira.module';
import { TaskService } from './task.service';
import { SpinalModule } from '../../spinal/spinal.module';

@Module({
  imports: [JiraModule, SpinalModule],
  controllers: [],
  providers: [TaskService],
})
export class TaskModule {}
