import { Global, Module } from '@nestjs/common';

import { PrismaService } from './adapters/prisma/prisma.service';
import { PrismaUserRepository } from './adapters/prisma/user.repository';

@Global()
@Module({
  providers: [PrismaService, PrismaUserRepository],
  exports: [PrismaService, PrismaUserRepository],
})
export class DataAccessModule {}
