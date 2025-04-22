import { registerAs } from '@nestjs/config';

import { validateEnv } from './env.schema';

export default registerAs('app', () => {
  const env = validateEnv();

  return {
    nodeEnv: env.NODE_ENV,

    // Server configuration
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    apiUrl: env.API_URL,
    pinoLogLevel: env.PINO_LOG_LEVEL,

    // CORS configuration
    corsOrigins: env.CORS_ORIGINS,

    // Cookie configuration
    cookieSecret: env.COOKIE_SECRET,

    // Throttler configuration
    throttler: {
      throttlers: [
        {
          name: 'short',
          ttl: env.THROTTLE_SHORT_TTL,
          limit: env.THROTTLE_SHORT_LIMIT,
        },
        {
          name: 'medium',
          ttl: env.THROTTLE_MEDIUM_TTL,
          limit: env.THROTTLE_MEDIUM_LIMIT,
        },
        {
          name: 'long',
          ttl: env.THROTTLE_LONG_TTL,
          limit: env.THROTTLE_LONG_LIMIT,
        },
      ],
    },

    // JWT configuration
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
    },

    // Database configuration
    database: {
      url: env.DATABASE_URL,
    },
  };
});
