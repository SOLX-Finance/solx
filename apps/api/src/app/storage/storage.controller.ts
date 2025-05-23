import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import {
  GenerateUploadUrlRequestDto,
  GenerateUploadUrlResponseDto,
} from './dtos/generate-upload-url.dto';
import {
  GetFileReadUrlRequestDto,
  GetFileReadUrlResponseDto,
} from './dtos/get-file-read-url.dto';
import { GetPublicFileRequestDto } from './dtos/get-public-file.dto';
import { StorageService } from './storage.service';

import { Public } from '../auth/decorators/is-public.decorator';
import {
  RequestUser,
  UserClaims,
} from '../auth/decorators/request-user.decorator';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Generate a signed upload URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns a signed upload URL',
    type: GenerateUploadUrlResponseDto,
  })
  async generateUploadUrl(
    @Query() { fileType, contentType }: GenerateUploadUrlRequestDto,
    @RequestUser() user: UserClaims,
  ): Promise<GenerateUploadUrlResponseDto> {
    return await this.storageService.getUploadUrl({
      fileType,
      contentType,
      userId: user.dbUser.id,
    });
  }

  @Public()
  @Get(':fileId')
  @ApiOperation({ summary: 'Get a public file' })
  @ApiParam({ name: 'fileId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns a public file',
    type: StreamableFile,
  })
  async getPublicFile(
    @Param() { fileId }: GetPublicFileRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { content, type } = await this.storageService.getFileContent({
      fileId,
      validateType: true,
    });

    // Set content type to image
    res.set({
      'Content-Type': type,
      'Content-Disposition': 'inline',
    });

    return new StreamableFile(content);
  }

  @Get('read-url/:fileId')
  @ApiOperation({ summary: 'Get a private file read URL' })
  @ApiParam({ name: 'fileId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns a private file read URL',
    type: GetFileReadUrlResponseDto,
  })
  async getPrivateFileReadUrl(
    @Param() { fileId }: GetFileReadUrlRequestDto,
    @RequestUser() user: UserClaims,
  ): Promise<GetFileReadUrlResponseDto> {
    return await this.storageService.getReadUrl({
      fileId,
      userId: user.dbUser.id,
    });
  }

  @Public()
  @Get('read-url/public/:fileId')
  @ApiOperation({ summary: 'Get a public file read URL' })
  @ApiParam({ name: 'fileId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns a public file read URL',
    type: GetFileReadUrlResponseDto,
  })
  async getPublicFileReadUrl(
    @Param() { fileId }: GetFileReadUrlRequestDto,
  ): Promise<GetFileReadUrlResponseDto> {
    return await this.storageService.getReadUrl({
      fileId,
    });
  }
}
