import { Module } from '@nestjs/common';
import { HubModule } from '../../core/hub/hub.module';
import { IssueHubRepository } from './issue-hub.repository';
import { IssueSpinalDomainService } from './issue-spinal-domain.service';
import { IssueSynchronizerService } from './issue-synchronizer.service';

@Module({
  imports: [HubModule],
  providers: [
    IssueSpinalDomainService,
    IssueSynchronizerService,
    IssueHubRepository,
  ],
  exports: [IssueSpinalDomainService, IssueSynchronizerService],
})
export class IssueModule {}
