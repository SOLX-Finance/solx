import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { File, FileType, Prisma } from '@prisma/client';
import { PrismaService } from '@solx/data-access';
import { ANALYZE_FILE_QUEUE, AnalyzeFilePayload } from '@solx/queues';
import { Queue } from 'bullmq';

import { randomUUID } from 'crypto';

import { StorjService } from './storj/storj.service';

@Injectable()
export class StorageService {
  constructor(
    private readonly storjService: StorjService,
    private readonly prisma: PrismaService,
    @InjectQueue(ANALYZE_FILE_QUEUE.name)
    private indexedTxQueue: Queue<AnalyzeFilePayload>,
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
    const uuid = randomUUID();

    const remoteId = `${fileType.toLowerCase()}/${uuid}`;

    // TODO: use repository
    const file = await this.prisma.file.create({
      data: {
        id: uuid,
        type: fileType,
        mimeType: contentType,
        userId,
        remoteId,
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

  async getReadUrl({ fileId, userId }: { fileId: string; userId?: string }) {
    // TODO: use repository
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        Sale: true, // Include the Sale relation
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (
      file.type !== FileType.SALE_CONTENT &&
      file.type !== FileType.SALE_DEMO
    ) {
      throw new BadRequestException(
        'File is not accessible by the private read url, use the public url instead',
      );
    }

    if (file.type === FileType.SALE_CONTENT) {
      if (!userId) {
        throw new Error('User id is required for sale content file type');
      }

      // Get user's wallet address for buyer comparison
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { walletAddress: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if user is either the file owner OR the buyer of the associated sale
      const isFileOwner = file.userId === userId;
      const isSaleBuyer = file.Sale?.buyer === user.walletAddress;

      if (!isFileOwner && !isSaleBuyer) {
        throw new UnauthorizedException('You do not have access to this file');
      }
    }

    if (file.deleted) {
      throw new NotFoundException(
        'File is found but content was removed, as it was flagged as malicious',
      );
    }

    const url = await this.storjService.getSignedReadUrl(file.remoteId);

    return { url };
  }

  async softDeleteFile(
    file: File,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    await prisma.file.update({
      where: { id: file.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    await this.storjService.deleteFile(file.remoteId);
  }

  async getFileContent({
    fileId,
    validateType,
  }: {
    fileId: string;
    validateType: boolean;
  }) {
    // TODO: use repository

    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }
    if (
      validateType &&
      (file.type === FileType.SALE_CONTENT || file.type === FileType.SALE_DEMO)
    ) {
      throw new BadRequestException('File is not accessible');
    }

    if (file.deleted) {
      throw new NotFoundException(
        'File is found but content was removed, as it was flagged as malicious',
      );
    }

    return this.getFileContentFromFile({ file });
  }

  async onFilesUploaded(files: File[]) {
    await this.indexedTxQueue.addBulk(
      files.map((file) => ({
        name: ANALYZE_FILE_QUEUE.name,
        data: {
          fileId: file.id,
        },
      })),
    );
  }

  async getFileContentFromFile({ file }: { file: File }) {
    return {
      content: await this.storjService.getFileContent(file.remoteId),
      type: file.mimeType,
    };
  }
}
