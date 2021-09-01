import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../../domain/user/user.entity';
import { UserService } from '../../domain/user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    this.logger.log('canActivate guard webscoket');

    const client = context.switchToWs().getClient();
    this.logger.log(client.handshake.headers.cookie);

    const cookies: string[] = client.handshake.headers.cookie.split('; ');
    const token = cookies.find((cookie) => cookie.startsWith('Token'));
    if (!token) {
      return false;
    }
    const authToken = token.split('=')[1];
    const jwtPayload: any = jwt.verify(authToken, jwtConstants.secret);

    const user: UserEntity = await this.userService.findById(jwtPayload.sub);
    // Bonus if you need to access your user after the guard
    // console.log(context.switchToWs().getData());
    context.switchToWs().getData().user = user;
    return Boolean(user);
  }
}
