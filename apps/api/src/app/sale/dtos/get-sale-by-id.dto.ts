import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetSaleByIdRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;
}
