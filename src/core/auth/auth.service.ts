import {
  ForbiddenException,
  Injectable,
  Logger,
  NotAcceptableException,
  PreconditionFailedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { readFileSync } from 'fs';
import { UserEntity } from '../../domain/user/user.entity';
import { UserService } from '../../domain/user/user.service';
import { MailService } from '../config/mail/mail.service';
import { RequestContextHelper } from '../context/request-context.helper';

import { AbstractService } from '../framework/abstract.service';
import { ConfigService } from './../config/config.service';
import { HasherService } from './hasher.service';
import {
  ForgotTarget,
  PostForgotPassword,
  UpdatePassword,
  Credentials,
} from './models/auth.models';

@Injectable()
export class AuthService extends AbstractService {
  protected logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly hasherService: HasherService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    super();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    if (await this.hasherService.verify(user.password, pass)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any, credentials: Credentials, response: Response): void {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '30d' });

    const cookieOption = this.buildCookieParams(credentials.savePassword);
    response.cookie('Token', token, cookieOption);
  }

  logout(response: Response): void {
    const cookieOption = this.buildCookieParams(false, true);
    response.cookie('Token', null, cookieOption);
  }

  async register(user: UserEntity) {
    user.password = await this.hasherService.hash(user.password);
    return this.try(this.usersService.saveUser(user));
  }

  async updatePassword(updatePassword: UpdatePassword): Promise<void> {
    const user = await RequestContextHelper.checkAndGetFullCurrentUser();
    const isVerified = await this.hasherService.verify(
      user.password,
      updatePassword.oldPassword,
    );

    if (!isVerified) {
      throw new NotAcceptableException();
    }
    user.password = await this.hasherService.hash(updatePassword.newPassword);

    await this.try(this.usersService.saveUser(user));
  }

  private buildCookieParams(
    savePassword: boolean,
    isLogout = false,
  ): CookieOptions {
    const secure = this.configService.isProduction;
    const cookieOptions: CookieOptions = {
      secure,
      httpOnly: true,
      sameSite: 'strict',
    };

    if (savePassword) {
      this.logger.log('password saved');
      cookieOptions.maxAge = 100000000;
    }

    if (isLogout) {
      this.logger.log('loggin out');
      cookieOptions.maxAge = 0;
    }

    return cookieOptions;
  }

  async sendForgotEmail(forgotTarget: ForgotTarget): Promise<void> {
    const token = await this.usersService.updateUserWithForgotToken(
      forgotTarget.email,
    );
    if (!token) {
      return;
    }
    let content = readFileSync(
      './dist/apps/api/assets/template/forgot-password.html',
    ).toString();
    const frontUrl = 'http://localhost:3000';
    content = content.replace(
      '{{link}}',
      `${frontUrl}/connection/forgot-password/${token}`,
    );
    this.mailService.sendEmail(forgotTarget.email, content);
  }

  async passwordForgot(forgotPassword: PostForgotPassword): Promise<void> {
    const twentyMinutes = 1000 * 60 * 20;
    const timestamp = +forgotPassword.token.substring(10);

    if (Date.now() - timestamp > twentyMinutes) {
      throw new PreconditionFailedException();
    }

    const user = await this.usersService.findByForgotToken(
      forgotPassword.token,
    );
    if (!user) {
      throw new ForbiddenException();
    }

    user.password = await this.hasherService.hash(forgotPassword.password);
    await this.try(this.usersService.saveUser(user));
  }
}
