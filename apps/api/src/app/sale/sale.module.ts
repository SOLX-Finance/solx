import { Module } from '@nestjs/common';

import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

import { StorageModule } from '../storage/storage.module';

@Module({
  controllers: [SaleController],
  providers: [SaleService],
  imports: [StorageModule],
  exports: [SaleService],
})
export class SaleModule {}
