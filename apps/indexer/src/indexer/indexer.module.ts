import { BullModule } from '@nestjs/bullmq';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INDEXED_TRANSACTION_QUEUE } from '@solx/queues';

import { IndexerConfig, IndexerService } from './indexer.service';

import { ProvidersModule } from '../provider/providers.module';

@Module({
  imports: [
    ProvidersModule,
    BullModule.registerQueueAsync({
      name: INDEXED_TRANSACTION_QUEUE.name,
    }),
  ],
  providers: [
    IndexerService,
    Logger,
    {
      provide: IndexerConfig,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const loopCycleDelay = +configService.getOrThrow(
          'app.indexer.loopCycleDelay',
        );
        const environment = configService.getOrThrow('app.indexer.indexEnv');

        return {
          loopCycleDelay,
          environment,
        };
      },
    },
  ],
  exports: [IndexerService],
})
export class IndexerModule {}
