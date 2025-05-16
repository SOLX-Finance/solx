import { ApiProperty } from '@nestjs/swagger';
import { KycStatus, Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The wallet address of the user',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  walletAddress: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    example: ['BUYER', 'CONTRIBUTOR'],
    enum: Role,
    isArray: true,
  })
  roles: Role[];

  @ApiProperty({
    description: 'Whether the user is blocked',
    example: false,
  })
  isBlocked: boolean;

  @ApiProperty({
    description: 'The KYC verification status of the user',
    example: 'VERIFIED',
    enum: KycStatus,
  })
  kycStatus: KycStatus;

  @ApiProperty({
    description: 'The date when the user was KYC verified',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  kycVerifiedAt: Date | null;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
    required: false,
    nullable: true,
  })
  username: string | null;

  @ApiProperty({
    description: 'The ID of the profile picture file',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true,
  })
  profilePictureId: string | null;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The earnings of the user',
    example: {
      earned: 1000,
      spent: 500,
      collateral: 1000,
    },
  })
  earnings?: {
    earned: number;
    spent: number;
    collateral: number;
  };
}
