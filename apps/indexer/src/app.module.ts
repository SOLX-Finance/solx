import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { DataAccessModule } from '@solx/data-access';

import appConfig from './config/configuration';
import { validateEnv } from './config/env.schema';
import { HealthController } from './health/health.controller';
import { IndexerModule } from './indexer/indexer.module';
import { LoggerModule } from './logger/logger.module';
import { ProvidersModule } from './provider/providers.module';

@Module({
  imports: [
    DataAccessModule,
    LoggerModule.forRoot({ global: true }),
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env.local', '.env'],
      validate: () => validateEnv(),
    }),

    // BullMQ
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.getOrThrow('app.redis.url');
        const rejectUnauthorized = config.getOrThrow(
          'app.redis.rejectUnauthorized',
        );
        return {
          connection: {
            url: redisUrl,
            tls: rejectUnauthorized
              ? undefined
              : {
                  rejectUnauthorized,
                },
          },
        };
      },
    }),

    // Health checks
    TerminusModule,

    IndexerModule,
    ProvidersModule,
    ProvidersModule,
  ],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class AppModule {}
