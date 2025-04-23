import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@solx/data-access';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const apiUrl = this.configService.get<string>('app.apiUrl');
    const apiPrefix = this.configService.get<string>('app.apiPrefix');
    const healthCheckUrl = `${apiUrl}/${apiPrefix}`;

    return this.health.check([
      // Database health check
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),

      // API self check
      () => this.http.pingCheck('api', healthCheckUrl),
    ]);
  }
}
