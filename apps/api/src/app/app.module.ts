import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { DataAccessModule } from '@solx/data-access';

import { AuthModule } from './auth/auth.module';
import appConfig from './config/configuration';
import { validateEnv } from './config/env.schema';
import { GlobalGuard } from './guards/global.guard';
import { HealthController } from './health/health.controller';
import { LoggerModule } from './logger/logger.module';
import { QueueProcessorModule } from './queue-processor/queue-processor.module';
import { SaleModule } from './sale/sale.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';

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

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('app.throttler'),
    }),

    // BullMQ
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.getOrThrow('app.redis.url');

        return {
          connection: {
            url: redisUrl,
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),

    // HTTP client
    HttpModule,

    // Health checks
    TerminusModule,

    // Auth
    AuthModule.forRoot(),

    // Storage
    StorageModule,

    // Queue processor
    QueueProcessorModule,

    // Marketplace modules (Projects, Purchases, ...)
    UsersModule,

    // Sale module
    SaleModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
  ],
})
export class AppModule {}
