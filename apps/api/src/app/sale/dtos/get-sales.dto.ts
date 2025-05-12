import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '@prisma/client';

export class GetSalesResponseDto {
  @ApiProperty({})
  sales: Sale[];
}
