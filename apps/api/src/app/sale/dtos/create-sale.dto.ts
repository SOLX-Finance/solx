import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}

export class CreateSaleResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
