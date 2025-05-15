import { PublicKey } from '@solana/web3.js';

import { SOLX_PROGRAM_ID } from '@/utils/programs.utils';

export const addresses = {
  devnet: {
    programs: {
      solx: SOLX_PROGRAM_ID,
    },
    globalState: new PublicKey('H5ZkAYbKVAnm8n5p8taHhrNWvBWQyY2PabXoD6QLXCDH'),
    authority: new PublicKey('Ay5QkFRYzDt7SpDoEJi5vKjZk3xqZTWeqpwKDNL1sLn6'),
    treasury: new PublicKey('Ay5QkFRYzDt7SpDoEJi5vKjZk3xqZTWeqpwKDNL1sLn6'),
  },
};
