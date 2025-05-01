import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const STORJ_BUCKET = 'STORJ_BUCKET';
export const STORJ_READ_URL_EXPIRATION = 'STORJ_READ_URL_EXPIRATION';
export const STORJ_UPLOAD_URL_EXPIRATION = 'STORJ_UPLOAD_URL_EXPIRATION';

@Injectable()
export class StorjService {
  constructor(
    private readonly s3Client: S3Client,
    @Inject(STORJ_BUCKET) private readonly bucket: string,
    @Inject(STORJ_READ_URL_EXPIRATION)
    private readonly readUrlExpiration: number,
    @Inject(STORJ_UPLOAD_URL_EXPIRATION)
    private readonly uploadUrlExpiration: number,
  ) {}

  async getSignedUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.uploadUrlExpiration,
    });
  }

  async getSignedReadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.readUrlExpiration,
    });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async getFileContent(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    return Buffer.from(await response.Body.transformToByteArray());
  }
}
