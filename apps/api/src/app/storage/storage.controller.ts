import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  StreamableFile,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  RequestUser,
  UserClaims,
} from '../auth/decorators/request-user.decorator';
import { Public } from '../auth/decorators/is-public.decorator';
import { StorageService } from './storage.service';
import { FileType } from '@prisma/client';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async generateUploadUrl(
    // TODO: move to DTO
    @Query('fileType', new ParseEnumPipe(FileType)) fileType: FileType,
    @Query('contentType') contentType: string,
    @RequestUser() user: UserClaims,
  ) {
    return await this.storageService.getUploadUrl({
      fileType,
      contentType,
      userId: user.dbUser.id,
    });
  }

  @Public()
  @Get(':fileId')
  async getPublicFile(
    // TODO: move to DTO
    @Param('fileId') fileId: string,
  ) {
    const fileContent = await this.storageService.getFileContent({
      fileId,
      validateType: true,
    });
    return new StreamableFile(fileContent);
  }

  @Get('read-url/:fileId')
  async getPrivateFileReadUrl(
    // TODO: move to DTO
    @Param('fileId') fileId: string,
    @RequestUser() user: UserClaims,
  ) {
    return await this.storageService.getReadUrl({
      fileId,
      userId: user.dbUser.id,
    });
  }
}
