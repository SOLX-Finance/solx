import { Injectable } from '@nestjs/common';
import { PrismaService } from '@solx/data-access';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSalesByUserAddress({ userAddress }: { userAddress: string }) {
    return await this.prisma.sale.findMany({
      where: {
        OR: [
          {
            buyer: userAddress,
          },
          {
            file: {
              User: {
                walletAddress: userAddress,
              },
            },
          },
        ],
      },
      include: {
        file: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  async getAllActiveSales() {
    return await this.prisma.sale.findMany({
      where: {
        buyer: null,
      },
      include: {
        file: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  async getSaleById({ id }: { id: string }) {
    return await this.prisma.sale.findUnique({
      where: { id },
      include: {
        file: {
          include: {
            User: true,
          },
        },
      },
    });
  }
}
