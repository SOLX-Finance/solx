import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@solx/data-access';

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

  async getAllSalesByUserAddress({ userAddress }: { userAddress: string }) {
    return await this.prisma.sale.findMany({
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
    });
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
