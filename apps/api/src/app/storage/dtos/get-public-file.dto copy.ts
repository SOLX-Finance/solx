import { FileType } from '@prisma/client';
import { ParseEnumPipe } from '@nestjs/common';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPublicFileRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  fileId: string;
}
