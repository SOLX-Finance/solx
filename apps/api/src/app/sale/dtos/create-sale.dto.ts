import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateSaleRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @IsArray()
  @IsString({ each: true })
  files: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional({ each: true })
  categories: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  whatYouWillGet: string;
}

export class CreateSaleResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
