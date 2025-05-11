import { z } from 'zod';

export const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('api'),
  API_URL: z.string().default('http://localhost:3000'),
  PINO_LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:4200'),

  // Cookies and Security
  COOKIE_SECRET: z
    .string()
    .min(32, 'Cookie secret should be at least 32 characters long'),

  // Throttling (Rate Limiting)
  THROTTLE_SHORT_TTL: z.coerce.number().default(1000),
  THROTTLE_SHORT_LIMIT: z.coerce.number().default(1),
  THROTTLE_MEDIUM_TTL: z.coerce.number().default(10000),
  THROTTLE_MEDIUM_LIMIT: z.coerce.number().default(4),
  THROTTLE_LONG_TTL: z.coerce.number().default(60000),
  THROTTLE_LONG_LIMIT: z.coerce.number().default(10),

  // Privy
  PRIVY_APP_ID: z.string(),
  PRIVY_SECRET: z.string(),

  // Database
  DATABASE_URL: z.string(),

  // Storj/S3 Configuration
  STORJ_ACCESS_KEY_ID: z.string(),
  STORJ_SECRET_ACCESS_KEY: z.string(),
  STORJ_BUCKET: z.string(),
  STORJ_READ_URL_EXPIRATION: z.coerce.number().default(3600),
  STORJ_UPLOAD_URL_EXPIRATION: z.coerce.number().default(3600),

  // AI
  AI_API_KEY: z.string(),
  AI_MODEL_ID: z.string().default('gpt-4o-mini'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
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
