import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrivyClient } from '@privy-io/server-auth';
import { PrivyAuthGuard } from './guards/privy-auth.guard';
import { DataAccessModule } from '@solx/data-access';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

export class AuthModule {
  static forRoot() {
    return {
      global: true,
      module: AuthModule,
      imports: [DataAccessModule],
      controllers: [AuthController],
      providers: [
        {
          provide: PrivyClient,
          inject: [ConfigService],
          useFactory(config: ConfigService) {
            console.log(config.get('app.privy'));
            return new PrivyClient(
              config.getOrThrow('app.privy.appId'),
              config.getOrThrow('app.privy.secret'),
            );
          },
        },
        PrivyAuthGuard,
        AuthService,
      ],
      exports: [PrivyClient, PrivyAuthGuard],
    };
  }
}
