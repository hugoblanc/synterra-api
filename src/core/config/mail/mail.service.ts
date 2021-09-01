import { Inject, Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { TransporterConfigToken } from './mail.token';
import { TransporterConfig } from './transporter.config';
import Mail = require('nodemailer/lib/mailer');

@Injectable()
export class MailService {
  mailTransporter: Mail;
  logger = new Logger(MailService.name);

  constructor(
    @Inject(TransporterConfigToken) private readonly config: TransporterConfig,
  ) {
    this.initTransport();
  }

  initTransport(): void {
    this.mailTransporter = createTransport(this.config);
  }

  async sendEmail(receiverEmail: string, html: string): Promise<void> {
    // send mail with defined transport object
    const info = await this.mailTransporter.sendMail({
      from: 'contact@pim-mobility.com', // sender address
      to: receiverEmail, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: html, // html body
    });

    this.logger.log('Message sent: %s', info.messageId);
  }
}
