import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@solx/data-access';
import { ANALYZE_FILE_QUEUE, AnalyzeFilePayload } from '@solx/queues';
import { Job } from 'bullmq';

import { FileAnalyzerService } from '../file-analyzer/file-analyzer.service';

@Processor(ANALYZE_FILE_QUEUE.name)
export class FileAnalyzerProcessor extends WorkerHost {
  private readonly logger = new Logger(FileAnalyzerProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileAnalyzer: FileAnalyzerService,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async process(job: Job<AnalyzeFilePayload, any, string>): Promise<void> {
    const { fileId } = job.data;

    const file = await this.prisma.file.findUniqueOrThrow({
      where: { id: fileId },
    });

    await this.fileAnalyzer.analyzeAndUpdateFile(file);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    const { id, name, queueName, failedReason, attemptsMade, opts } = job;

    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}. Attempt ${attemptsMade}/${opts.attempts}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
