import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JiraHttpService } from './jira-http.service';

@Module({
  imports: [HttpModule],
  providers: [JiraHttpService],
  exports: [JiraHttpService],
})
export class JiraHttpModule {}
