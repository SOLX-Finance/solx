import * as anchor from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

import { addresses } from '@/config/addresses';
import { solanaConnection } from '@/config/connection';
import { Solx, SolxIDL } from '@/idls/solx.idl';

export const useSolxContract = () => {
  const solxProgram = new anchor.Program<Solx>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SolxIDL as any,
    // TODO: use cluster from env
    addresses.devnet.programs.solx,
    new anchor.AnchorProvider(
      solanaConnection,
      new NodeWallet(anchor.web3.Keypair.generate()),
      {
        commitment: 'finalized',
      },
    ),
  );

  return {
    solxProgram,
  };
};
