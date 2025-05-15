import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetSalesByUserRequestDto {
  @ApiProperty({
    description: 'Page number (starting from 1)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 9,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 9))
  limit?: number = 9;
}

export class GetSalesByUserParamDto {
  @ApiProperty({
    description: 'The wallet address of the user',
  })
  @IsString()
  userAddress: string;
}

export class GetSalesByUserResponseDto {
  @ApiProperty({})
  sales: Sale[];

  @ApiProperty({
    description: 'Total number of sales',
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  totalPages: number;
}
