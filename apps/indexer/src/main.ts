import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';

function setupSwagger<T>(app: INestApplication<T>, prefix: string) {
  const config = new DocumentBuilder()
    .setTitle('SOLX Indexer API')
    .setDescription('The API for SOLX Indexer')
    .setVersion('1.0')
    .addTag('solx')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/swagger`, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth token after reload
      withCredentials: true, // Ensures cookies are sent with request
    },
  });
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      bufferLogs: true,
    });

    const configService = app.get(ConfigService);

    app.useLogger(await app.get(PinoLogger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    const globalPrefix = 'api';

    app.setGlobalPrefix(globalPrefix);
    setupSwagger(app, globalPrefix);

    const port = configService.get<number>('app.port');
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
    Logger.log(
      `🚀 Swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`,
    );

    const signals = ['SIGTERM', 'SIGINT'];
    for (const signal of signals) {
      process.on(signal, async () => {
        Logger.log(`Received ${signal}, shutting down...`, 'Bootstrap');
        await app.close();
        Logger.log('Application shutdown complete', 'Bootstrap');
        process.exit(0);
      });
    }
  } catch (error) {
    Logger.error(`Error during bootstrap: ${error.message}`, 'Bootstrap');
    process.exit(1);
  }
}

bootstrap();
