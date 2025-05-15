import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';
import { PrismaService } from '@solx/data-access';

import { AiService } from '../ai/ai.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class FileAnalyzerService {
  constructor(
    private readonly aiService: AiService,
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  async analyzeAndUpdateFile(file: File) {
    const { content } = await this.storageService.getFileContentFromFile({
      file,
    });

    const base64Content = content.toString('base64');

    const contentHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(base64Content),
    );

    const analysisResult = await this.aiService.analyzeFile(base64Content);

    await this.prisma.$transaction(async (tx) => {
      await tx.file.update({
        where: { id: file.id },
        data: {
          aiReviewed: true,
          aiReviewDetails: analysisResult,
          contentHash: Buffer.from(contentHash).toString('hex'),
        },
      });

      if (analysisResult.shouldRemove) {
        await this.storageService.softDeleteFile(file, tx);
      }
    });
  }
}
