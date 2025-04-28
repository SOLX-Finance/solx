import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_ALLOW_NO_DB_USER_KEY = 'isAllowNoDbUser';
export const AllowNoDbUser = () => SetMetadata(IS_ALLOW_NO_DB_USER_KEY, true);

export const isAllowedNoDbUser = (
  ctx: ExecutionContext,
  reflector: Reflector,
) => {
  return reflector.getAllAndOverride<boolean>(IS_ALLOW_NO_DB_USER_KEY, [
    ctx.getHandler(),
    ctx.getClass(),
  ]);
};
