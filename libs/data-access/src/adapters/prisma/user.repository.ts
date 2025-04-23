import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    if (!record) return null;
    return record;
  }

  async findById(userId: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!record) return null;
    return record;
  }

  async save(user: User): Promise<User> {
    const upserted = await this.prisma.user.upsert({
      where: { id: user.id },
      update: { ...user },
      create: { ...user },
    });
    return upserted;
  }
}
