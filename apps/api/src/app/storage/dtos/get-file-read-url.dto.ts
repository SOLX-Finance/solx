import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
