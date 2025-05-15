import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataAccessModule } from '@solx/data-access';

import {
  AI_ANALYZE_ENABLED,
  FileAnalyzerService,
} from './file-analyzer.service';

import { AiModule } from '../ai/ai.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DataAccessModule, AiModule, StorageModule],
  providers: [
    FileAnalyzerService,
    {
      provide: AI_ANALYZE_ENABLED,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('app.ai.enableAIAnalyze'),
    },
  ],
  exports: [FileAnalyzerService],
})
export class FileAnalyzerModule {}
