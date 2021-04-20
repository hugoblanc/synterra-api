import { DynamicModule, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TransporterConfigToken } from './mail.token';
import { TransporterConfig } from './transporter.config';

@Module({
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {
  static forRoot(config: TransporterConfig): DynamicModule {
    return {
      module: MailModule,
      providers: [
        MailService,
        {
          provide: TransporterConfigToken,
          useValue: config
        }
      ]
    }
  }
}
