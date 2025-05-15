import { Injectable } from '@nestjs/common';
import { Connection } from '@solana/web3.js';

export const PROVIDERS_CONFIG = 'PROVIDERS_CONFIG' as const;

export class ProvidersServiceConfig {
  rpcUrl: string;
}

@Injectable()
export class ProvidersService {
  constructor(public readonly config: ProvidersServiceConfig) {}

  getProvider() {
    if (!this.config.rpcUrl)
      throw new Error('Provider for SOL is not configured');
    const provider = new Connection(this.config.rpcUrl, 'finalized');
    return provider;
  }
}
