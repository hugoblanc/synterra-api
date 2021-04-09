import { Module } from '@nestjs/common';
import { QuantityService } from './quantity.service';
import { QuantityController } from './quantity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuantityEntity } from './entities/quantity.entity';
import { SpinalModule } from '../../spinal/spinal.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuantityEntity]), SpinalModule],
  controllers: [QuantityController],
  providers: [QuantityService],
})
export class QuantityModule {}
