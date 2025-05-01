import { Module } from '@nestjs/common';
import {
  STORJ_BUCKET,
  STORJ_READ_URL_EXPIRATION,
  STORJ_UPLOAD_URL_EXPIRATION,
  StorjService,
} from './storj.service';
import { DataAccessModule } from '@solx/data-access';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [],
  providers: [
    StorjService,
    {
      provide: STORJ_BUCKET,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.getOrThrow('app.storj.bucket');
      },
    },
    {
      provide: STORJ_READ_URL_EXPIRATION,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.getOrThrow('app.storj.readUrlExpiration');
      },
    },
    {
      provide: STORJ_UPLOAD_URL_EXPIRATION,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.getOrThrow('app.storj.uploadUrlExpiration');
      },
    },
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new S3Client({
          endpoint: 'https://gateway.storjshare.io',
          credentials: {
            accessKeyId: config.getOrThrow('app.storj.accessKeyId'),
            secretAccessKey: config.getOrThrow('app.storj.secretAccessKey'),
          },
          // TODO: move to config
          region: 'eu1',
          forcePathStyle: true,
        });
      },
    },
  ],
  exports: [StorjService],
})
export class StorjModule {}
