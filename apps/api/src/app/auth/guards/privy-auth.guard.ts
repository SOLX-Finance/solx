import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PrivyClient } from '@privy-io/server-auth';
import { isAllowedNoDbUser } from '../decorators/allow-no-db-user.decorator';
import { Reflector } from '@nestjs/core';
import { isPublic } from '../decorators/is-public.decorator';
import { PrismaService } from '@solx/data-access';

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
    const idToken = request.cookies?.['privy-id-token'];

    if (!idToken) {
      throw new UnauthorizedException('`privy-id-token` cookie is required');
    }

    try {
      const user = await this.privyClient.getUser({ idToken });

      const dbUser = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!user.email || !user.wallet) {
        throw new UnauthorizedException('Missing email or wallet');
      }

      if (!dbUser && !isAllowedNoDbUser(context, this.reflector)) {
        throw new UnauthorizedException('User not found');
      }

      // Attach the user to the request object for use in controllers
      request['user'] = {
        privyUser: user,
        dbUser,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
