import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AllowNoDbUser } from './decorators/allow-no-db-user.decorator';
import { RequestUser, UserClaims } from './decorators/request-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user')
  @HttpCode(HttpStatus.OK)
  @AllowNoDbUser()
  @ApiOperation({
    summary: 'Synchronize authenticated user',
    description:
      'Creates a user in the database if it does not exist, or returns the existing user.',
  })
  @ApiCookieAuth('privy-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User synchronized successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication token is missing or invalid',
  })
  async createUser(@RequestUser() user: UserClaims): Promise<UserResponseDto> {
    const dbUser =
      user.dbUser ||
      (await this.authService.createUserFromPrivyUser(user.externalUser));

    return {
      message: 'User synchronized successfully',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        walletAddress: dbUser.walletAddress,
        roles: dbUser.roles,
      },
    };
  }
}
