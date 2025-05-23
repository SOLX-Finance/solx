import { registerAs } from '@nestjs/config';

import { validateEnv } from './env.schema';

export default registerAs('app', () => {
  const env = validateEnv();

  return {
    // Environment configuration
    nodeEnv: env.NODE_ENV,

    // Server configuration
    port: env.PORT,
    pinoLogLevel: env.PINO_LOG_LEVEL,

    // Database configuration
    database: {
      url: env.DATABASE_URL,
    },

    // Redis configuration
    redis: {
      url: env.REDIS_URL,
      useCluster: env.REDIS_USE_CLUSTER,
      rejectUnauthorized: env.REDIS_REJECT_UNAUTHORIZED,
    },

    // Indexer configuration
    indexer: {
      loopCycleDelay: env.INDEXER_LOOP_CYCLE_DELAY,
      indexEnv: env.INDEX_ENV,
    },

    // RPC configuration
    rpc: {
      url: env.RPC_URL,
    },
  };
});
