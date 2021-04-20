import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { DishModule } from './domain/dish/dish.module';
import { DomainModule } from './domain/domain.module';
import { ReportingModule } from './reporting/reporting.module';
import { SpinalModule } from './spinal/spinal.module';
import { ZeltyModule } from './zelty/zelty.module';

@Module({
  imports: [
    SpinalModule,
    ZeltyModule,
    ConfigModule,
    DishModule,
    DomainModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
