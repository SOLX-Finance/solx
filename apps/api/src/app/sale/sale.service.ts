import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@solx/data-access';

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

    await this.storageService.onFilesUploaded(fileEntities);

    return sale;
  }

  async getAllSalesByUserAddress({
    userAddress,
    page = 1,
    limit = 9,
  }: {
    userAddress: string;
    page?: number;
    limit?: number;
  }) {
    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await this.prisma.sale.count({
      where: {
        OR: [
          {
            buyer: userAddress,
          },
          {
            creator: userAddress,
          },
        ],
      },
    });

    // Get paginated sales
    const sales = await this.prisma.sale.findMany({
      where: {
        OR: [
          {
            buyer: userAddress,
          },
          {
            creator: userAddress,
          },
        ],
      },
      include: {
        files: true,
        user: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      sales,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async getAllActiveSales() {
    return await this.prisma.sale.findMany({
      where: {
        buyer: null,
      },
      include: {
        files: true,
        user: true,
      },
    });
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
