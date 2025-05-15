import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '@prisma/client';
import { IsString } from 'class-validator';

export class GetSalesByUserRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  userAddress: string;
}

export class GetSalesByUserResponseDto {
  @ApiProperty({})
  sales: Sale[];
}
