import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrivyClient } from '@privy-io/server-auth';
import { PrismaService } from '@solx/data-access';
import { Request } from 'express';

import { isAllowedNoDbUser } from '../decorators/allow-no-db-user.decorator';
import { isPublic } from '../decorators/is-public.decorator';

export const UsePrivyAuthGuard = () => UseGuards(PrivyAuthGuard);

@Injectable()
export class PrivyAuthGuard implements CanActivate {
  constructor(
    private readonly privyClient: PrivyClient,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublic(context, this.reflector)) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const idToken = request.cookies?.['privy-token'];

    if (!idToken) {
      throw new UnauthorizedException('`privy-token` cookie is required');
    }

    try {
      const verifiedClaims = await this.privyClient.verifyAuthToken(idToken);
      const user = await this.privyClient.getUserById(verifiedClaims.userId);

      const dbUser = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!user.email && !user.wallet) {
        throw new UnauthorizedException(
          'User must have either email or wallet authentication',
        );
      }

      if (!dbUser && !isAllowedNoDbUser(context, this.reflector)) {
        throw new UnauthorizedException('User not found in database');
      }

      // Attach the user to the request object for use in controllers
      request['user'] = {
        externalUser: user,
        dbUser,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Authentication error');
    }
  }
}
