import { z } from 'zod';

export const envSchema = z.object({
  // Application settings
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Privy authentication
  PRIVY_APP_ID: z.string().min(1, 'Privy App ID is required'),
  PRIVY_CLIENT_ID: z.string().min(1, 'Privy Client ID is required'),

  // API configuration
  API_URL: z
    .string()
    .url('API URL must be a valid URL')
    .default('http://localhost:3000/api'),

  // RPC configuration
  RPC_URL: z
    .string()
    .url('RPC URL must be a valid URL')
    .default('https://api.devnet.solana.com'),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const validateEnv = (): EnvSchema => {
  const env = {
    NODE_ENV: import.meta.env.MODE || 'development',
    PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID,
    PRIVY_CLIENT_ID: import.meta.env.VITE_PRIVY_CLIENT_ID,
    API_URL: import.meta.env.VITE_API_URL,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      );
      throw new Error(
        `Environment validation failed:\n${errorMessages.join('\n')}`,
      );
    }
    throw error;
  }
};
