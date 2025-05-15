import { ConfigService } from '@nestjs/config';
import { PrivyClient } from '@privy-io/server-auth';
import { DataAccessModule } from '@solx/data-access';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrivyAuthGuard } from './guards/privy-auth.guard';

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
