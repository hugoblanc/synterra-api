import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import { MailModule } from './mail/mail.module';
import { config } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailModule.forRoot({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'contact@pim-mobility.com', // generated ethereal user
        pass: process.env.PIM_EMAIL, // generated ethereal password
      },
    }),
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService, MailModule],
})
export class ConfigModule {}
