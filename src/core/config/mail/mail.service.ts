import { Inject, Injectable } from '@nestjs/common';
import { createTransport } from "nodemailer";
import Mail = require('nodemailer/lib/mailer');
import { TransporterConfigToken } from './mail.token';
import { TransporterConfig } from './transporter.config';

@Injectable()
export class MailService {

  mailTransporter: Mail;
  constructor(@Inject(TransporterConfigToken) private readonly config: TransporterConfig) {
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
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);

  }


}
