import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production'] as const)
    .default('development'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:1234@localhost:5432/solx'),
  RPC_URL: z.string(),
  INDEXER_LOOP_CYCLE_DELAY: z.coerce.number().default(5000),
  PORT: z.coerce.number().default(3004),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_USE_CLUSTER: z.coerce.boolean().default(false),
  INDEX_ENV: z.enum(['devnet', 'mainnet'] as const).default('devnet'),
  PINO_LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'] as const)
    .default('info'),
});

export type EnvSchema = z.infer<typeof envSchema>;

export function validateEnv(): EnvSchema {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage =
        'Environment validation failed:\n' +
        error.errors
          .map((err) => `- ${err.path.join('.')}: ${err.message}`)
          .join('\n');
      throw new Error(errorMessage);
    }
    throw error;
  }
}
