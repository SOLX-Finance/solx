import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DataAccessModule } from '@solx/data-access';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/configuration';
import { validateEnv } from './config/env.schema';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    DataAccessModule,

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

    // HTTP client
    HttpModule,

    // Health checks
    TerminusModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
