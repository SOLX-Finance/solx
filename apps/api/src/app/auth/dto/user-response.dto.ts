import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'did:privy:123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  email: string;

  @ApiProperty({
    description: 'User wallet address',
    example: 'GExcb4K3fwJYHnQqJMJTrpMJtN9nTKjdWmbnRiDhUhm9',
    required: false,
  })
  walletAddress: string;

  @ApiProperty({
    description: 'User roles in the system',
    example: ['USER'],
    enum: Role,
    isArray: true,
  })
  roles: Role[];
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'User synchronized successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto,
  })
  user: UserDto;
}
