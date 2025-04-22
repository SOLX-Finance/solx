import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Options } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';

export class LoggerModule {
  static forRoot({ global }: { global: boolean }): DynamicModule {
    return {
      module: LoggerModule,
      global,
      imports: [
        PinoLoggerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            const isProduction = config.get('app.nodeEnv') === 'production';

            return {
              pinoHttp: [
                {
                  autoLogging: false,
                  level: config.get('app.pinoLogLevel'),
                  transport: !isProduction
                    ? {
                        target: 'pino-pretty',
                        options: {
                          colorize: true,
                          translateTime: true,
                          ignore: 'pid,hostname',
                        },
                      }
                    : undefined,
                  serializers: {
                    req: (req) => ({
                      id: req.id,
                      method: req.method,
                      url: req.url,
                    }),
                  },
                  formatters: {
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    bindings: () => {},
                    level: (label) => {
                      return { level: label.toUpperCase() };
                    },
                  },
                  timestamp: () =>
                    `,"time":"${new Date(Date.now()).toISOString()}"`,
                  genReqId: (req, res) => {
                    const existingID = req.id || req.headers['x-request-id'];
                    if (existingID) {
                      return existingID;
                    }

                    const traceContext = req.headers['x-cloud-trace-context'];
                    if (traceContext) {
                      const traceId = traceContext.split('/')[0];
                      res.setHeader('x-request-id', traceId);
                      return traceId;
                    }

                    const id = uuidv4();
                    res.setHeader('x-request-id', id);
                    return id;
                  },
                },
              ] as Options,
            };
          },
        }),
      ],
    };
  }
}
