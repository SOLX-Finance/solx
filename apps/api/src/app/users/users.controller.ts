import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KycStatus, Role } from '@prisma/client';

import { CompleteKycVerificationDto } from './dtos/kyc-verification.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersService } from './users.service';

import {
  RequestUser,
  UserClaims,
} from '../auth/decorators/request-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(PrivyAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully retrieved',
    type: UserResponseDto,
  })
  async getCurrentUser(
    @RequestUser() user: UserClaims,
  ): Promise<UserResponseDto> {
    const userDb = await this.usersService.findById(user.dbUser.id);
    const earnings = await this.usersService.getEarnings(
      user.dbUser.walletAddress,
    );
    return { ...userDb, earnings };
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({ summary: 'Get user by wallet address' })
  @ApiParam({
    name: 'walletAddress',
    description: 'The wallet address of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully retrieved',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserByWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByWalletAddress(walletAddress);
    const earnings = await this.usersService.getEarnings(walletAddress);

    return { ...user, earnings };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully updated',
    type: UserResponseDto,
  })
  async updateProfile(
    @RequestUser() user: UserClaims,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const userDb = await this.usersService.updateProfile(
      user.dbUser.id,
      updateProfileDto,
    );
    const earnings = await this.usersService.getEarnings(
      user.dbUser.walletAddress,
    );
    return { ...userDb, earnings };
  }

  @Post('me/kyc/start')
  @ApiOperation({ summary: 'Start KYC verification process' })
  @ApiResponse({
    status: 200,
    description: 'KYC verification process has been started',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'KYC verification already in progress or completed',
  })
  async startKycVerification(
    @RequestUser() user: UserClaims,
  ): Promise<UserResponseDto> {
    return this.usersService.startKycVerification(user.dbUser.id);
  }

  // Admin endpoints
  @Post(':id/kyc/complete')
  @ApiOperation({ summary: 'Complete KYC verification process' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'KYC verification has been completed',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'KYC verification not in progress',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async completeKycVerification(
    @Param('id') id: string,
    @Body() completeKycDto: CompleteKycVerificationDto,
  ): Promise<UserResponseDto> {
    return this.usersService.completeKycVerification(
      id,
      completeKycDto.isApproved,
      completeKycDto.details,
    );
  }

  @Get('kyc/:status')
  @ApiOperation({ summary: 'Get users by KYC status' })
  @ApiParam({ name: 'status', enum: KycStatus, description: 'KYC status' })
  @ApiResponse({
    status: 200,
    description: 'Users have been successfully retrieved',
    type: [UserResponseDto],
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async getUsersByKycStatus(
    @Param('status') status: KycStatus,
  ): Promise<UserResponseDto[]> {
    return this.usersService.findByKycStatus(status);
  }
}
