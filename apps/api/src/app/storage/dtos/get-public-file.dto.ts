import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPublicFileRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  fileId: string;
}
