import { createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';
import { User as PrivyUser } from '@privy-io/server-auth';

export class UserClaims {
  externalUser: PrivyUser;
  dbUser: User | null;
}

export const RequestUser = createParamDecorator((data, req) => {
  return req.args[0].user as UserClaims;
});
