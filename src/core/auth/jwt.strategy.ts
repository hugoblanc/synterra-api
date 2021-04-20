import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: fromCookieExtractor(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    this.logger.debug(`${payload.sub} ${payload.email}`);
    const id = payload.sub;
    const email = payload.email;
    const validatedContent = { id, email };

    return validatedContent;
  }
}

function fromCookieExtractor() {
  const logger = new Logger();
  return (req: Request) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['Token'];
      logger.debug(token);
    }
    return token;
  };
}
