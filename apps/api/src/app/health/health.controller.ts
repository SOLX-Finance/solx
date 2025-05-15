import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@solx/data-access';

import { Public } from '../auth/decorators/is-public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database health check
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ]);
  }
}
