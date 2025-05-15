import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Sale } from '@prisma/client';

import {
  CreateSaleRequestDto,
  CreateSaleResponseDto,
} from './dtos/create-sale.dto';
import { GetActiveSalesQueryDto } from './dtos/get-active-sales.dto';
import { GetSaleByIdRequestDto } from './dtos/get-sale-by-id.dto';
import {
  GetSalesByUserRequestDto,
  GetSalesByUserParamDto,
  GetSalesByUserResponseDto,
} from './dtos/get-sales-by-user.dto';
import { GetSalesResponseDto } from './dtos/get-sales.dto';
import { SaleService } from './sale.service';

import { Public } from '../auth/decorators/is-public.decorator';
import {
  RequestUser,
  UserClaims,
} from '../auth/decorators/request-user.decorator';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a sale' })
  @ApiResponse({
    status: 200,
    description: 'Returns the id of the created sale',
  })
  async createSale(
    @Body() body: CreateSaleRequestDto,
    @RequestUser() user: UserClaims,
  ): Promise<CreateSaleResponseDto> {
    const sale = await this.saleService.createSale({
      ...body,
      user: user.dbUser,
    });

    return {
      id: sale.id,
    };
  }

  @Public()
  @Get('/active')
  @ApiOperation({ summary: 'Get active sales' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'price-low', 'price-high'],
  })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered, sorted, and paginated active sales',
  })
  async getActiveSales(
    @Query() query: GetActiveSalesQueryDto,
  ): Promise<GetSalesResponseDto> {
    const { page = 1, limit = 8, search, sortBy, category } = query;

    return await this.saleService.getActiveSales({
      page: Number(page),
      limit: Number(limit),
      search,
      sortBy,
      category,
    });
  }

  @Public()
  @Get('user/:userAddress')
  @ApiOperation({ summary: 'Get sales by user address' })
  @ApiParam({ name: 'userAddress', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['newest', 'price-low', 'price-high'],
  })
  @ApiQuery({ name: 'filter', required: false, enum: ['created', 'bought'] })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered, sorted, and paginated sales by user',
  })
  async getSalesByUserAddress(
    @Param() { userAddress }: GetSalesByUserParamDto,
    @Query() { page, limit, search, sortBy, filter }: GetSalesByUserRequestDto,
  ): Promise<GetSalesByUserResponseDto> {
    return await this.saleService.getSalesByUserAddress({
      userAddress,
      page: Number(page),
      limit: Number(limit),
      search,
      sortBy,
      filter,
    });
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
