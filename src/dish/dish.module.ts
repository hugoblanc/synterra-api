import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './entities/dish.entity';
import { ZeltyModule } from '../zelty/zelty.module';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity]), ZeltyModule],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
