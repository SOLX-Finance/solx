import { DynamicModule } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

export class LoggerModule {
  static forRoot({ global }: { global: boolean }): DynamicModule {
    return {
      module: LoggerModule,
      global,
      imports: [PinoLoggerModule.forRoot({})],
    };
  }
}
