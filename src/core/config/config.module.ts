import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import { config } from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config), EventEmitterModule.forRoot()],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
