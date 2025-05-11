import { Module } from '@nestjs/common';
import { DataAccessModule } from '@solx/data-access';

import { FileAnalyzerProcessor } from './file-analyzer.processor';

import { FileAnalyzerModule } from '../file-analyzer/file-analyzer.module';

@Module({
  imports: [DataAccessModule, FileAnalyzerModule],
  providers: [FileAnalyzerProcessor],
})
export class QueueProcessorModule {}
