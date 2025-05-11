import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DataAccessModule } from '@solx/data-access';
import { ANALYZE_FILE_QUEUE } from '@solx/queues';

import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { StorjModule } from './storj/storj.module';

@Module({
  imports: [
    StorjModule,
    DataAccessModule,
    BullModule.registerQueue({
      name: ANALYZE_FILE_QUEUE.name,
    }),
  ],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
