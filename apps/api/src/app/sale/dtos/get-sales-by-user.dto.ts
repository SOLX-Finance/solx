import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { SortOption } from './get-active-sales.dto';

export class GetSalesByUserRequestDto {
  @ApiProperty({
    description: 'Page number (starting from 1)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 9,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 9;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    enum: SortOption,
    default: SortOption.NEWEST,
  })
  @IsOptional()
  @IsEnum(SortOption)
  sortBy?: SortOption = SortOption.NEWEST;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  filter?: SalesFilter;
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

export enum SalesFilter {
  CREATED = 'created',
  BOUGHT = 'bought',
}
