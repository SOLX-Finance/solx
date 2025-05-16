import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@solx/data-access';

import { CATEGORIES, CATEGORY_MAP, Category } from './constants';
import { SortOption } from './dtos/get-active-sales.dto';
import { SalesFilter } from './dtos/get-sales-by-user.dto';

import { StorageService } from '../storage/storage.service';

@Injectable()
export class SaleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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

    const normalizedCategories = categories
      .map((category) => {
        const lowercaseCategory = category.toLowerCase();
        return CATEGORY_MAP[lowercaseCategory] || category;
      })
      .filter((category): category is Category =>
        CATEGORIES.includes(category as Category),
      );

    const sale = await this.prisma.sale.create({
      data: {
        files: { connect: fileEntities.map((file) => ({ id: file.id })) },
        title,
        description,
        userId: user.id,
        creator: user.walletAddress,
        categories: normalizedCategories,
      },
    });

    await this.storageService.onFilesUploaded(fileEntities);

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

    let where: Prisma.SaleWhereInput = {
      priceUsd: {
        not: null,
      },
    };

    if (filter === SalesFilter.CREATED) {
      where.creator = userAddress;
    } else if (filter === SalesFilter.BOUGHT) {
      where.buyer = userAddress;
    } else {
      where.OR = [{ creator: userAddress }, { buyer: userAddress }];
    }

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

  async getActiveSales({
    page = 1,
    limit = 8,
    search,
    sortBy = SortOption.NEWEST,
    categories,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: SortOption;
    categories?: string[];
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.SaleWhereInput = {
      buyer: null, // Only active (unsold) sales
      priceUsd: {
        not: null,
      },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ];
    }

    if (categories && categories.length > 0) {
      // Normalize categories to proper case
      const normalizedCategories = categories
        .map((category) => {
          const lowercaseCategory = category.toLowerCase();
          return CATEGORY_MAP[lowercaseCategory] || category;
        })
        .filter((category): category is Category =>
          CATEGORIES.includes(category as Category),
        );

      where.categories = {
        hasSome: normalizedCategories,
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
