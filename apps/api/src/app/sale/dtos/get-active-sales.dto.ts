import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SortOption {
  NEWEST = 'newest',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
}

export class GetActiveSalesQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 8 })
  @IsOptional()
  @IsNumber()
  limit?: number = 8;

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
  category?: string;
}
