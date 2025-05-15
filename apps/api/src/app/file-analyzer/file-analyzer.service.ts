import { Inject, Injectable, Logger } from '@nestjs/common';
import { File } from '@prisma/client';
import { PrismaService } from '@solx/data-access';

import { AiService } from '../ai/ai.service';
import { StorageService } from '../storage/storage.service';

export const AI_ANALYZE_ENABLED = 'AI_ANALYZE_ENABLED';

@Injectable()
export class FileAnalyzerService {
  private readonly logger = new Logger(FileAnalyzerService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
    @Inject(AI_ANALYZE_ENABLED)
    private readonly enableAnalyze: boolean,
  ) {}

  async analyzeAndUpdateFile(file: File) {
    if (!this.enableAnalyze) {
      this.logger.debug('Skipping AI analyze as it is disabled', file.id);
      return;
    }

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
