import { Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { UserEntity } from './../../domain/user/user.entity';
import { RequestContext } from './request-context.model';

/**
 * Request Context helper to access the current user or request
 */
export class RequestContextHelper {
  private static logger = new Logger();

  static getCurrentUser(): UserEntity | undefined {
    const request = this.getCurrentRequest();
    const user = (request as any).user as UserEntity;
    return user;
  }

  static checkAndGetCurrentUser(): UserEntity {
    const user: UserEntity = this.getCurrentUser();

    if (!user) {
      this.logger.error('Get current user was called on a non guard route');
      throw new UnauthorizedException();
    }

    return user;
  }

  static getCurrentUserId(): string {
    const user = this.checkAndGetCurrentUser();
    return user.id;
  }

  static checkAndGetFullCurrentUser(): Promise<UserEntity> {
    const user = this.checkAndGetCurrentUser();
    const id = user.id;
    return UserEntity.findOne({ id });
  }

  static get currentRequestId(): number | null {
    const requestContext = this.getCurrentContext();
    return (requestContext && requestContext.requestId) || null;
  }

  static getCurrentRequest(): Request {
    return this.getCurrentContext()?.req || null;
  }

  private static getCurrentContext(): RequestContext {
    const requestContext = RequestContext.currentContext;
    return requestContext || null;
  }

  private static getHeaderFromContext(headerName: string): string {
    return this.getCurrentRequest().headers[headerName] as string;
  }
}
