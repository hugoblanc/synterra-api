import { Module } from '@nestjs/common';
import { AvgTimingModule } from '@synterra/shared';
import { SynterraAnalyticsService } from './synterra-analytics.service';

@Module({
  imports: [AvgTimingModule],
  controllers: [],
  providers: [SynterraAnalyticsService],
  exports: [SynterraAnalyticsService],
})
export class AnalyticsModule {}
