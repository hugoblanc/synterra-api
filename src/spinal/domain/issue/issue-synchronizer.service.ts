import { Injectable } from '@nestjs/common';
import { SpinalInterface } from 'src/spinal/core/framework/spinal-model';
import { IssueHubRepository } from './issue-hub.repository';

@Injectable()
export class IssueSynchronizerService {
  constructor(private readonly hub: IssueHubRepository) {}

  store() {
    const value: any[] = [];
    this.hub.store((value as unknown) as SpinalInterface).subscribe();
  }
}
