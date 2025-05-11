import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class GenerateUploadUrlRequestDto {
  @ApiProperty({ enum: FileType })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty()
  @IsString()
  contentType: string;
}

export class GenerateUploadUrlResponseDto {
  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  fileId: string;
}
