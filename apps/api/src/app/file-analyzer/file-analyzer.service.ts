import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { File } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { PrismaService } from '@solx/data-access';

@Injectable()
export class FileAnalyzerService {
  constructor(
    private readonly aiService: AiService,
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  async analyzeAndUpdateFile(file: File) {
    const { content, type } = await this.storageService.getFileContentFromFile({
      file,
    });

    const analysisResult = await this.aiService.analyzeFile(
      content.toString('base64'),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.file.update({
        where: { id: file.id },
        data: {
          aiReviewed: true,
          aiReviewDetails: analysisResult,
        },
      });

      if (analysisResult.shouldRemove) {
        await this.storageService.softDeleteFile(file, tx);
      }
    });
  }
}
