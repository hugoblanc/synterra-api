import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IssueHubRepository } from './issue-hub.repository';

@Injectable()
export class IssueSpinalDomainService {
  constructor(private readonly hub: IssueHubRepository) {}

  findAll(): Observable<any[]> {
    return this.hub.findAll<any>();
  }
}
