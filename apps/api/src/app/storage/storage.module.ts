import { Module } from '@nestjs/common';
import { DataAccessModule } from '@solx/data-access';
import { StorageService } from './storage.service';
import { StorjModule } from './storj/storj.module';
import { StorageController } from './storage.controller';
import { BullModule } from '@nestjs/bullmq';
import { ANALYZE_FILE_QUEUE } from '@solx/queues';

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
