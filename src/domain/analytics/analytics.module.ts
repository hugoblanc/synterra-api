import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SynterraAnalyticsService } from './synterra-analytics.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [SynterraAnalyticsService],
  exports: [SynterraAnalyticsService],
})
export class AnalyticsModule {}
