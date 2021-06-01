import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IssueHubRepository } from './issue-hub.repository';

@Injectable()
export class IssueSynchronizerService implements OnModuleInit {
  logger = new Logger(IssueSynchronizerService.name);
  constructor(private readonly hub: IssueHubRepository) {}

  onModuleInit(): void {
    this.logger.log('Checking dish spinal state');
  }

  store() {
    // const value: any[] = [];
    // this.hub.store((value as unknown) as Model).subscribe();
  }
}
