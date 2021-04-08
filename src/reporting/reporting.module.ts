import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { SpinalModule } from '../spinal/spinal.module';
import { ReportingController } from './reporting.controller';

@Module({
  imports: [SpinalModule],
  providers: [ReportingService],
  controllers: [ReportingController],
})
export class ReportingModule {}
