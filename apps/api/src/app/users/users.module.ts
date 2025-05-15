import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { StorageModule } from '../storage/storage.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [StorageModule],
  exports: [UsersService],
})
export class UsersModule {}
