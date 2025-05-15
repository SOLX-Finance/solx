import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@solx/data-access';

import { SortOption } from './dtos/get-active-sales.dto';
import { SalesFilter } from './dtos/get-sales-by-user.dto';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async createSale({
    user,
    title,
    description,
    files,
    categories,
  }: {
    user: User;
    files: string[];
    title: string;
    description: string;
    categories: string[];
  }) {
    const fileEntities = await this.prisma.file.findMany({
      where: {
        id: { in: files },
      },
    });

    if (fileEntities.length !== files.length) {
      throw new BadRequestException('Some file ids are invalid');
    }

    if (fileEntities.filter((v) => v.type === 'SALE_CONTENT').length !== 1) {
      throw new BadRequestException('Sale must have exactly one content file');
    }

    if (fileEntities.filter((v) => v.type === 'SALE_DEMO').length > 1) {
      throw new BadRequestException('Sale must have at most one demo file');
    }

    if (
      fileEntities.filter(
        (v) => v.type === 'KYC_DOCUMENT' || v.type === 'PROFILE_PICTURE',
      ).length
    ) {
      throw new BadRequestException(
        'Sale files cannot include KYC documents or profile pictures',
      );
    }

    const sale = await this.prisma.sale.create({
      data: {
        files: { connect: fileEntities.map((file) => ({ id: file.id })) },
        title,
        description,
        userId: user.id,
        creator: user.walletAddress,
        categories,
      },
    });

    return sale;
  }

  async getSalesByUserAddress({
    userAddress,
    page = 1,
    limit = 9,
    search,
    sortBy = SortOption.NEWEST,
    filter,
  }: {
    userAddress: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: SortOption;
    filter?: SalesFilter;
  }) {
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    let where: Prisma.SaleWhereInput = {};

    // Apply user filter (created/bought)
    if (filter === SalesFilter.CREATED) {
      where.creator = userAddress;
    } else if (filter === SalesFilter.BOUGHT) {
      where.buyer = userAddress;
    } else {
      // Default: show both created and bought
      where.OR = [{ creator: userAddress }, { buyer: userAddress }];
    }

    // Add search filter if provided
    if (search) {
      const searchCondition = {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      };

      // Combine search with existing filters
      if (where.OR) {
        // If we already have OR conditions, we need to restructure
        where = {
          AND: [{ OR: where.OR }, searchCondition],
        };
      } else {
        // Otherwise, just add the search conditions
        where = {
          ...where,
          ...searchCondition,
        };
      }
    }

    // Get total count for pagination metadata
    const totalCount = await this.prisma.sale.count({ where });

    // Determine the sort order
    let orderBy: Prisma.SaleOrderByWithRelationInput = {};
    switch (sortBy) {
      case SortOption.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SortOption.PRICE_LOW:
        orderBy = { priceUsd: 'asc' };
        break;
      case SortOption.PRICE_HIGH:
        orderBy = { priceUsd: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get paginated and filtered sales
    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        files: true,
        user: true,
      },
      skip,
      take: limit,
      orderBy,
    });

    return {
      sales,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async getActiveSales({
    page = 1,
    limit = 8,
    search,
    sortBy = SortOption.NEWEST,
    category,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: SortOption;
    category?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.SaleWhereInput = {
      buyer: null, // Only active (unsold) sales
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ];
    }

    if (category && category !== 'all') {
      where.categories = {
        has: category,
      };
    }

    const totalCount = await this.prisma.sale.count({ where });

    let orderBy: Prisma.SaleOrderByWithRelationInput = {};
    switch (sortBy) {
      case SortOption.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SortOption.PRICE_LOW:
        orderBy = { priceUsd: 'asc' };
        break;
      case SortOption.PRICE_HIGH:
        orderBy = { priceUsd: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        files: true,
        user: true,
      },
      skip,
      take: limit,
      orderBy,
    });

    return {
      sales,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async getSaleById({ id }: { id: string }) {
    return await this.prisma.sale.findUnique({
      where: { id },
      include: {
        files: true,
        user: true,
      },
    });
  }
}
