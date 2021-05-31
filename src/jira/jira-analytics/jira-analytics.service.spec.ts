import { Test, TestingModule } from '@nestjs/testing';
import { JiraAnalyticsService } from './jira-analytics.service';

describe('JiraAnalyticsService', () => {
  let service: JiraAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JiraAnalyticsService],
    }).compile();

    service = module.get<JiraAnalyticsService>(JiraAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
