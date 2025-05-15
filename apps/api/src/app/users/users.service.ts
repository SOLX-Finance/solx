import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { File, KycStatus, Prisma, Role, User } from '@prisma/client';
import { PrismaService, PrismaUserRepository } from '@solx/data-access';

import { StorageService } from '../storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: PrismaUserRepository,
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.userRepository.findByWalletAddress(walletAddress);
    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${walletAddress} not found`,
      );
    }
    return user;
  }

  async findByKycStatus(
    status: KycStatus,
    options?: { skip?: number; take?: number },
  ): Promise<User[]> {
    return this.userRepository.findByKycStatus(status, options);
  }

  async updateProfile(
    userId: string,
    data: { username?: string; profilePictureId?: string },
  ): Promise<User> {
    const user = await this.findById(userId);

    user.username = data.username ?? user.username;
    user.profilePictureId = data.profilePictureId ?? user.profilePictureId;

    let file: File | null = null;

    if (data.profilePictureId) {
      file = await this.prisma.file.findUnique({
        where: { id: data.profilePictureId },
      });
      if (!file) {
        throw new BadRequestException(
          `File with ID ${data.profilePictureId} not found`,
        );
      }
    }

    const updatedUser = await this.userRepository.save(user);

    if (file) {
      await this.storageService.onFilesUploaded([file]);
    }

    return updatedUser;
  }

  // KYC verification methods
  async startKycVerification(userId: string): Promise<User> {
    const user = await this.findById(userId);

    if (
      user.kycStatus !== KycStatus.NOT_STARTED &&
      user.kycStatus !== KycStatus.REJECTED
    ) {
      throw new BadRequestException(
        `KYC verification already ${user.kycStatus.toLowerCase()}`,
      );
    }

    return this.userRepository.updateKycStatus(userId, KycStatus.IN_PROGRESS);
  }

  async completeKycVerification(
    userId: string,
    isApproved: boolean,
    details?: Prisma.JsonValue,
  ): Promise<User> {
    const user = await this.findById(userId);

    if (user.kycStatus !== KycStatus.IN_PROGRESS) {
      throw new BadRequestException('KYC verification not in progress');
    }

    const status = isApproved ? KycStatus.VERIFIED : KycStatus.REJECTED;
    return this.userRepository.updateKycStatus(userId, status, details);
  }

  async isKycVerified(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return user.kycStatus === KycStatus.VERIFIED;
  }

  // Permission methods
  async hasRole(userId: string, role: Role): Promise<boolean> {
    const user = await this.findById(userId);
    return user.roles.includes(role);
  }

  async canUploadFiles(userId: string): Promise<boolean> {
    return this.isKycVerified(userId);
  }
}
