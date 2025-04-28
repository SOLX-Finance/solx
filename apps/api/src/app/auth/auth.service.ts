import { User } from '@privy-io/server-auth';
import { PrismaService } from '@solx/data-access';

export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserFromPrivyUser(privyUser: User) {
    return await this.prisma.user.create({
      data: {
        email: privyUser.email?.address!,
        walletAddress: privyUser.wallet?.address!,
        id: privyUser.id,
      },
    });
  }
}
