import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { StorjService } from './storj/storj.service';
import { PrismaService } from '@solx/data-access';
import { FileType } from '@prisma/client';

@Injectable()
export class StorageService {
  constructor(
    private readonly storjService: StorjService,
    private readonly prisma: PrismaService,
  ) {}

  async getUploadUrl({
    fileType,
    contentType,
    userId,
  }: {
    fileType: FileType;
    contentType: string;
    userId: string;
  }) {
    const file = await this.prisma.file.create({
      data: {
        type: fileType,
        mimeType: contentType,
        userId,
      },
    });

    const url = await this.storjService.getSignedUploadUrl(
      file.remoteId,
      contentType,
    );

    return {
      url,
      fileId: file.id,
    };
  }

  async getReadUrl({ fileId, userId }: { fileId: string; userId: string }) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new Error('File not found');
    }

    if (
      file.type !== FileType.SALE_CONTENT &&
      file.type !== FileType.SALE_DEMO
    ) {
      throw new BadRequestException(
        'File is not accessible by the private read url, use the public url instead',
      );
    }

    if (file.userId !== userId) {
      throw new UnauthorizedException('File does not belong to the user');
    }

    const url = await this.storjService.getSignedReadUrl(file.remoteId);

    return { url };
  }

  async deleteFile({ fileId }: { fileId: string }): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const file = await tx.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error('File not found');
      }

      await tx.file.delete({
        where: { id: fileId },
      });

      await this.storjService.deleteFile(file.remoteId);
    });
  }

  async getFileContent({
    fileId,
    validateType,
  }: {
    fileId: string;
    validateType: boolean;
  }) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new Error('File not found');
    }
    if (
      validateType &&
      (file.type === FileType.SALE_CONTENT || file.type === FileType.SALE_DEMO)
    ) {
      throw new BadRequestException('File is not accessible');
    }

    return await this.storjService.getFileContent(file.remoteId);
  }
}
