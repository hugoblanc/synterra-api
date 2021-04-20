import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from '../../domain/user/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { LocalAuthGuard } from './local-auth.guard';
import {
  Credentials,
  ForgotTarget,
  PostForgotPassword,
  UpdatePassword,
} from './models/auth.models';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(204)
  async register(@Body() user: UserEntity): Promise<UserEntity> {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
    @Body() credentials: Credentials,
  ): Promise<void> {
    this.authService.login(req.user, credentials, response);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    this.authService.logout(response);
  }

  @Put('send-forgot-password-email')
  async sendForgotEmail(@Body() forgotTarget: ForgotTarget): Promise<void> {
    return this.authService.sendForgotEmail(forgotTarget);
  }

  @Put('password-forgot')
  async passwordForgot(
    @Body() forgotPassword: PostForgotPassword,
  ): Promise<void> {
    return this.authService.passwordForgot(forgotPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  getProfile(): void {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  @HttpCode(204)
  updatePassword(@Body() updatedPassword: UpdatePassword): Promise<void> {
    return this.authService.updatePassword(updatedPassword);
  }
}
