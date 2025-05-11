import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
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

  async getReadUrl({ fileId, userId }: { fileId: string; userId: string }) {
    // TODO: use repository
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
      throw new Error('File not found');
    }
    if (
      validateType &&
      (file.type === FileType.SALE_CONTENT || file.type === FileType.SALE_DEMO)
    ) {
      throw new BadRequestException('File is not accessible');
    }

    return this.getFileContentFromFile({ file });
  }

  async onFileUploaded(file: File) {
    await this.indexedTxQueue.add(ANALYZE_FILE_QUEUE.name, {
      fileId: file.id,
    });
  }

  async getFileContentFromFile({ file }: { file: File }) {
    return {
      content: await this.storjService.getFileContent(file.remoteId),
      type: file.mimeType,
    };
  }
}
