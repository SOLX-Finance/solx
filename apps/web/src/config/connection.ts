import { Connection } from '@solana/web3.js';

import { env } from './env';

export const solanaConnection = new Connection(env.rpc.url);
