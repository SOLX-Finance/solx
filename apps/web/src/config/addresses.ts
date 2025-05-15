import { PublicKey } from '@solana/web3.js';

export const addresses = {
  devnet: {
    programs: {
      solx: new PublicKey('72GoG8mDsCuBMBSQZe3TmXtgQgNxuAzCh4ipgyRJqGCi'),
    },
    globalState: new PublicKey('H5ZkAYbKVAnm8n5p8taHhrNWvBWQyY2PabXoD6QLXCDH'),
    authority: new PublicKey('Ay5QkFRYzDt7SpDoEJi5vKjZk3xqZTWeqpwKDNL1sLn6'),
    treasury: new PublicKey('Ay5QkFRYzDt7SpDoEJi5vKjZk3xqZTWeqpwKDNL1sLn6'),
  },
};
