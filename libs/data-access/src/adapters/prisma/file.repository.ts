import { Injectable } from '@nestjs/common';
import { File, PrismaClient } from '@prisma/client';

import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdOrThrow(id: string, tx?: PrismaClient): Promise<File> {
    tx ??= this.prisma;
    const record = await this.prisma.file.findUnique({ where: { id } });
    if (!record) throw new Error('File not found');
    return record;
  }

  async delete(file: File, tx?: PrismaClient): Promise<void> {
    tx ??= this.prisma;
    await tx.file.delete({
      where: { id: file.id },
    });
  }
}
