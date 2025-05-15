import { validateEnv } from './env.schema';

export const env = (() => {
  try {
    const validatedEnv = validateEnv();

    return {
      // Application
      nodeEnv: validatedEnv.NODE_ENV,

      // Authentication
      privy: {
        appId: validatedEnv.PRIVY_APP_ID,
        clientId: validatedEnv.PRIVY_CLIENT_ID,
      },

      // API
      api: {
        url: validatedEnv.API_URL,
      },

      // RPC
      rpc: {
        url: validatedEnv.RPC_URL,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Environment validation error:', error);
    } else {
      console.error('Invalid environment configuration.');
    }

    return {
      nodeEnv: 'development' as const,
      privy: {
        appId: 'invalid-app-id', // This will cause auth to fail gracefully
        clientId: 'invalid-client-id',
      },
      api: {
        url: 'http://localhost:3000', // Default API URL
      },
      rpc: {
        url: 'https://api.devnet.solana.com', // Default RPC URL
      },
    };
  }
})();
