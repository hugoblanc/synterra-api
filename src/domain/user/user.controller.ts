import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import { JwtAuthGuard } from '../../core/auth/jwt.guard';
import { UserEntity } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get('current-user')
  getProfile(@CurrentUser() user: UserEntity): UserEntity {
    return user;
  }
}
