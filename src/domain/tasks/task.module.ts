import { Module } from '@nestjs/common';
import { SpinalModule } from 'src/spinal/spinal.module';
import { JiraModule } from '../../jira/jira.module';
import { TaskService } from './task.service';

@Module({
  imports: [JiraModule, SpinalModule],
  controllers: [],
  providers: [TaskService],
})
export class TaskModule {}
