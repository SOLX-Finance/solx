import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetFileReadUrlRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  fileId: string;
}

export class GetFileReadUrlResponseDto {
  @ApiProperty({ type: String })
  @IsString()
  url: string;
}
