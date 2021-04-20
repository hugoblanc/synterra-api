import { ReportingService } from './reporting.service';
import { Module } from '@nestjs/common';
import { MatrixReportingService } from './matrix/matrix-reporting.service';
import { SpinalModule } from '../spinal/spinal.module';
import { ReportingController } from './reporting.controller';
import { OrderReportingService } from './order/order-reporting.service';

@Module({
  imports: [SpinalModule],
  providers: [ReportingService, MatrixReportingService, OrderReportingService],
  controllers: [ReportingController],
})
export class ReportingModule {}
