import { PublicKey } from '@solana/web3.js';

export const addresses = {
  devnet: {
    programs: {
      solx: new PublicKey('8jbXs1fR9Bm5dh7N6Dr4ySsZWEeHeKTgsTYFjL386bcN'),
    },
    globalState: new PublicKey('6r8DxfB89V3zPBDt6pW1DL3r946sjP1bKs58vXN3896c'),
    authority: new PublicKey('Ay5QkFRYzDt7SpDoEJi5vKjZk3xqZTWeqpwKDNL1sLn6'),
    treasury: new PublicKey('6r8DxfB89V3zPBDt6pW1DL3r946sjP1bKs58vXN3896c'),
  },
};
