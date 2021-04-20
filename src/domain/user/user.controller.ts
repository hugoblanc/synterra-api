import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../core/auth/current-user.decorator';
import { JwtAuthGuard } from '../../core/auth/jwt.guard';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('current-user')
  getProfile(@CurrentUser() user: UserEntity): UserEntity {
    return user;
  }

  // @Put()
  // @HttpCode(204)
  // updateUser(@Body() iuser: IUpdateUser): Promise<void> {
  //   return this.service.updateUser(iuser);
  // }
}
