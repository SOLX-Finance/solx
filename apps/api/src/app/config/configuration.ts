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

    // Privy configuration
    privy: {
      appId: env.PRIVY_APP_ID,
      secret: env.PRIVY_SECRET,
    },

    // Storj configuration
    storj: {
      bucket: env.STORJ_BUCKET,
      accessKeyId: env.STORJ_ACCESS_KEY_ID,
      secretAccessKey: env.STORJ_SECRET_ACCESS_KEY,
      readUrlExpiration: env.STORJ_READ_URL_EXPIRATION,
      uploadUrlExpiration: env.STORJ_UPLOAD_URL_EXPIRATION,
    },

    // AI configuration
    ai: {
      apiKey: env.AI_API_KEY,
      modelId: env.AI_MODEL_ID,
    },

    // Database configuration
    database: {
      url: env.DATABASE_URL,
    },

    // Redis configuration
    redis: {
      url: env.REDIS_URL,
      rejectUnauthorized: env.REDIS_REJECT_UNAUTHORIZED,
    },
  };
});
