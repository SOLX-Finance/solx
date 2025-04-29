import { createParamDecorator } from '@nestjs/common';
import { User as PrivyUser } from '@privy-io/server-auth';
import { User } from '@prisma/client';

export class UserClaims {
  externalUser: PrivyUser;
  dbUser: User;
}

export const RequestUser = createParamDecorator((data, req) => {
  return req.args[0].user as UserClaims;
});
