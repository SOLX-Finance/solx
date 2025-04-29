import { Module } from '@nestjs/common';
import { DataAccessModule } from '@solx/data-access';
import { StorageService } from './storage.service';
import { StorjModule } from './storj/storj.module';
import { StorageController } from './storage.controller';

@Module({
  imports: [StorjModule, DataAccessModule],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
