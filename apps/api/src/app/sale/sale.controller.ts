import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Sale } from '@prisma/client';

import { GetSaleByIdRequestDto } from './dtos/get-sale-by-id.dto';
import {
  GetSalesByUserRequestDto,
  GetSalesByUserResponseDto,
} from './dtos/get-sales-by-user.dto';
import { GetSalesResponseDto } from './dtos/get-sales.dto';
import { SaleService } from './sale.service';

import { Public } from '../auth/decorators/is-public.decorator';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Public()
  @Get('/active')
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({
    status: 200,
    description: 'Returns all sales',
  })
  async getActiveSales(): Promise<GetSalesResponseDto> {
    return {
      sales: await this.saleService.getAllActiveSales(),
    };
  }

  @Public()
  @Get('user/:userAddress')
  @ApiOperation({ summary: 'Get all sales by user address' })
  @ApiParam({ name: 'userAddress', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns all sales by user address',
  })
  async getSalesByUserAddress(
    @Param() { userAddress }: GetSalesByUserRequestDto,
  ): Promise<GetSalesByUserResponseDto> {
    return {
      sales: await this.saleService.getAllSalesByUserAddress({ userAddress }),
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns a sale',
  })
  async getSaleById(@Param() { id }: GetSaleByIdRequestDto): Promise<Sale> {
    const sale = await this.saleService.getSaleById({ id });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }
}
