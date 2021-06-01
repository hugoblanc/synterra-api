import { Module, HttpModule } from '@nestjs/common';
import { JiraHttpService } from './jira-http.service';

@Module({
  imports: [HttpModule],
  providers: [JiraHttpService],
  exports: [JiraHttpService],
})
export class JiraHttpModule {}
