import { ConflictException, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestUser, UserClaims } from './decorators/request-user.decorator';
import { AllowNoDbUser } from './decorators/allow-no-db-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: move to user controller
  @Post('user')
  @AllowNoDbUser()
  async createUser(@RequestUser() user: UserClaims) {
    if (user.dbUser) {
      throw new ConflictException('User was already created');
    }

    await this.authService.createUserFromPrivyUser(user.externalUser);
  }
}
