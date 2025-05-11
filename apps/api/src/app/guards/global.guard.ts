// auth/guards/global.guard.ts
import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';

import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly privyAuthGuard: PrivyAuthGuard,
    // FIXME: add throttler guard
    // private readonly throttlerGuard: ThrottlerGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const throttlerResult = await this.throttlerGuard.canActivate(context);
    // if (!throttlerResult) {
    //   return false;
    // }

    const privyResult = await this.privyAuthGuard.canActivate(context);
    if (!privyResult) {
      return false;
    }

    return true;
  }
}
