import { Injectable } from '@nestjs/common';
import { KycStatus, Role } from '@prisma/client';
import { User as PrivyUser } from '@privy-io/server-auth';
import { PrismaUserRepository } from '@solx/data-access';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async createUserFromPrivyUser(privyUser: PrivyUser) {
    const existingUser = await this.userRepository.findById(privyUser.id);

    if (existingUser) {
      return existingUser;
    }

    const email = privyUser.email?.address ?? '';
    const walletAddress = privyUser.wallet?.address ?? '';

    return await this.userRepository.save({
      id: privyUser.id,
      email,
      walletAddress,
      roles: [Role.USER],
      isBlocked: false,
      kycStatus: KycStatus.NOT_STARTED,
      kycDetails: null,
      kycVerifiedAt: null,
      username: null,
      profilePictureId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
