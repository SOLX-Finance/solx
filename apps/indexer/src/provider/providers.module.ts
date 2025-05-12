import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ProvidersServiceConfig, ProvidersService } from './providers.service';

@Module({
  imports: [],
  providers: [
    ProvidersService,
    Logger,
    {
      provide: ProvidersServiceConfig,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rpcUrl = configService.getOrThrow('app.rpc.url');

        return {
          rpcUrl,
        };
      },
    },
  ],
  exports: [ProvidersService],
})
export class ProvidersModule {}
