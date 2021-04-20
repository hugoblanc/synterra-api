import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '../../domain/user/user.entity';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.user?.id) {
      const id = req.user?.id;
      return await UserEntity.findOne({ id });
    } else {
      return null;
    }
  },
);
