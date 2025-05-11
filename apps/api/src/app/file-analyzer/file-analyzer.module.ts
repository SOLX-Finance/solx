import { Module } from '@nestjs/common';
import { DataAccessModule } from '@solx/data-access';

import { FileAnalyzerService } from './file-analyzer.service';

import { AiModule } from '../ai/ai.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DataAccessModule, AiModule, StorageModule],
  providers: [FileAnalyzerService],
  exports: [FileAnalyzerService],
})
export class FileAnalyzerModule {}
