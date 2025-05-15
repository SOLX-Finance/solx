/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { randomUUID } from 'crypto';

import { IDL } from '../target/types/solx';
import { Solx } from '../target/types/solx';
import {
  getWhitelistedState,
  getPaymentMintState,
} from '../tests/common/common.helpers';
import { FEED_IDS, seeds, FEE, SOL_MINT } from '../tests/constants/constants';
import { SOLX_PROGRAM_ID } from '../tests/constants/contract.constants';
import {
  closeListing,
  createListing,
  purchaseListing,
} from '../tests/helpers/ixs';

const USDC_MINT = new PublicKey('DBmcHvg83bzdVEG68xsbQZmXHDqWYKioKJwGGu7rPRXX');

const connection = new Connection('https://api.devnet.solana.com');

const anchor = require('@coral-xyz/anchor');

const inited = true;
const needMint = false;

export default async function main() {
  const provider = AnchorProvider.env();

  anchor.setProvider(provider);

  const program = new Program<Solx>(IDL, SOLX_PROGRAM_ID, provider);

  const authority = new Keypair((provider.wallet as any).payer._keypair);

  const globalState = Keypair.generate();

  const [vault] = PublicKey.findProgramAddressSync(
    [seeds.VAULT_SEED, globalState.publicKey.toBuffer()],
    SOLX_PROGRAM_ID,
  );

  if (!inited) {
    const initProtocolTx = new Transaction().add(
      await program.methods
        .initialize(
          authority.publicKey,
          authority.publicKey,
          authority.publicKey,
          FEE,
        )
        .accounts({
          signer: authority.publicKey,
          globalState: globalState.publicKey,
          vault,
        })
        .signers([authority, globalState])
        .instruction(),
    );

    await provider.sendAndConfirm(initProtocolTx, [authority, globalState]);

    console.log('Global state initialized', globalState.publicKey.toBase58());

    const [whitelistedStateSol] = getWhitelistedState(
      globalState.publicKey,
      SOL_MINT,
    );

    const whitelistSolIx = new Transaction().add(
      await program.methods
        .whitelist(SOL_MINT, true)
        .accounts({
          authority: authority.publicKey,
          globalState: globalState.publicKey,
          whitelistedState: whitelistedStateSol,
        })
        .signers([authority])
        .instruction(),
    );

    await provider.sendAndConfirm(whitelistSolIx, [authority]);

    console.log('Whitelisted SOL');

    console.log('Created USDC mint: ', USDC_MINT.toBase58());

    const [whitelistedStateUsdc] = getWhitelistedState(
      globalState.publicKey,
      USDC_MINT,
    );

    const whitelistUsdcIx = new Transaction().add(
      await program.methods
        .whitelist(USDC_MINT, true)
        .accounts({
          authority: authority.publicKey,
          globalState: globalState.publicKey,
          whitelistedState: whitelistedStateUsdc,
        })
        .signers([authority])
        .instruction(),
    );

    await provider.sendAndConfirm(whitelistUsdcIx, [authority]);

    console.log('Whitelisted USDC');

    const [solMintState] = getPaymentMintState(globalState.publicKey, SOL_MINT);
    const [usdcMintState] = getPaymentMintState(
      globalState.publicKey,
      USDC_MINT,
    );

    const updateSolMintIx = new Transaction().add(
      await program.methods
        .updateMint(SOL_MINT, FEED_IDS.SOL)
        .accounts({
          authority: authority.publicKey,
          globalState: globalState.publicKey,
          paymentMintState: solMintState,
        })
        .signers([authority])
        .instruction(),
    );

    const updateUsdcMintIx = new Transaction().add(
      await program.methods
        .updateMint(USDC_MINT, FEED_IDS.USDC)
        .accounts({
          authority: authority.publicKey,
          globalState: globalState.publicKey,
          paymentMintState: usdcMintState,
        })
        .signers([authority])
        .instruction(),
    );

    await provider.sendAndConfirm(updateSolMintIx, [authority]);
    await provider.sendAndConfirm(updateUsdcMintIx, [authority]);

    console.log('Updated SOL and USDC feeds');
  } else {
    const buyer = Keypair.generate();

    if (needMint) {
      const buyerAta = await getOrCreateAssociatedTokenAccount(
        connection,
        authority,
        USDC_MINT,
        buyer.publicKey,
      );

      const authorityAta = await getOrCreateAssociatedTokenAccount(
        connection,
        authority,
        USDC_MINT,
        authority.publicKey,
      );

      await mintTo(
        connection,
        authority,
        USDC_MINT,
        buyerAta.address,
        authority.publicKey,
        1_000_000_000 * 10 ** 6,
      );

      await mintTo(
        connection,
        authority,
        USDC_MINT,
        authorityAta.address,
        authority.publicKey,
        1_000_000_000 * 10 ** 6,
      );

      await sleep(3000);

      console.log('Minted USDC to buyer and authority');
    }

    try {
      const globalState = new PublicKey(
        'H5ZkAYbKVAnm8n5p8taHhrNWvBWQyY2PabXoD6QLXCDH',
      );

      await simulateSaleFlows(
        program,
        authority,
        buyer,
        globalState,
        authority.publicKey,
      );
    } catch (e) {
      console.error(e);
    } finally {
      await sleep(10000);
      const balance = await connection.getBalance(buyer.publicKey, 'finalized');
      await sendSol(connection, buyer, authority.publicKey, balance);
      console.log('Sent SOL to authority');

      const buyerBalance = await connection.getBalance(
        buyer.publicKey,
        'finalized',
      );

      await sendSol(
        connection,
        buyer,
        authority.publicKey,
        buyerBalance - 5000,
      );
    }
  }
}

main().catch(console.error);

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function randAmount() {
  return Number((Math.random() * 0.1).toFixed(4));
}

async function simulateSaleFlows(
  solxProgram: Program<Solx>,
  seller: Keypair,
  buyer: Keypair,
  globalState: PublicKey,
  treasury: PublicKey,
) {
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed',
  );

  const uuidA = randomUUID();
  const priceA = Math.floor(randAmount() * 10 ** 6);
  console.log(`a) [${uuidA}] price=${priceA} SOL`);

  await createListing({
    connection,
    payer: seller,
    uuid: uuidA,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: SOL_MINT,
    collateralAmount: Math.floor(randAmount() * 10 ** 8),
    price: priceA,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });

  const uuidB = randomUUID();
  const priceB = Math.floor(randAmount() * 10 ** 6);
  console.log(`b) [${uuidB}] price=${priceB} SOL`);
  await createListing({
    connection,
    payer: seller,
    uuid: uuidB,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: SOL_MINT,
    collateralAmount: Math.floor(randAmount() * 10 ** 8),
    price: priceB,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });
  await closeListing({
    connection,
    payer: seller,
    uuid: uuidB,
    globalState,
    collateralMint: SOL_MINT,
    paymentMint: null,
    treasury,
    program: solxProgram,
  });
  console.log(`b) [${uuidB}] closed`);

  const uuidC = randomUUID();
  const priceC = Math.floor(randAmount() * 10 ** 6);
  console.log(`c) [${uuidC}] price=${priceC} SOL`);
  await createListing({
    connection,
    payer: seller,
    uuid: uuidC,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: SOL_MINT,
    collateralAmount: Math.floor(randAmount() * 10 ** 8),
    price: priceC,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });

  await purchaseListing({
    connection,
    payer: buyer,
    uuid: uuidC,
    paymentMint: SOL_MINT,
    globalStatePubkey: globalState,
    program: solxProgram,
  });
  console.log(`c) [${uuidC}] purchased`);

  const uuidDa = randomUUID();
  const priceDa = Math.floor(randAmount() * 10 ** 6);
  console.log(`da) [${uuidDa}] price=${priceDa} USDC`);
  await createListing({
    connection,
    payer: seller,
    uuid: uuidDa,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: USDC_MINT,
    collateralAmount: 1000 * 10 ** 6,
    price: priceDa,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });
  await purchaseListing({
    connection,
    payer: buyer,
    uuid: uuidDa,
    paymentMint: USDC_MINT,
    globalStatePubkey: globalState,
    program: solxProgram,
  });

  const uuidDb = randomUUID();
  const priceDb = Math.floor(randAmount() * 10 ** 6);
  console.log(`db) [${uuidDb}] price=${priceDb} USDC`);
  await createListing({
    connection,
    payer: seller,
    uuid: uuidDb,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: USDC_MINT,
    collateralAmount: Math.floor(randAmount() * 10 ** 6),
    price: priceDb,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });
  await purchaseListing({
    connection,
    payer: buyer,
    uuid: uuidDb,
    paymentMint: SOL_MINT,
    globalStatePubkey: globalState,
    program: solxProgram,
  });

  const uuidDc = randomUUID();
  const priceDc = Math.floor(randAmount() * 10 ** 6);
  console.log(`dc) [${uuidDc}] price=${priceDc} USDC`);
  await createListing({
    connection,
    payer: seller,
    uuid: uuidDc,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: USDC_MINT,
    collateralAmount: Math.floor(randAmount() * 10 ** 6),
    price: priceDc,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });
  await purchaseListing({
    connection,
    payer: buyer,
    uuid: uuidDc,
    paymentMint: SOL_MINT,
    globalStatePubkey: globalState,
    program: solxProgram,
  });

  const uuidD = randomUUID();
  const priceD = Math.floor(randAmount() * 10 ** 6);
  console.log(`d) [${uuidD}] price=${priceD} SOL`);
  await createListing({
    connection,
    payer: seller,
    uuid: uuidD,
    name: `NFT`,
    symbol: `ASDASD`,
    uri: `https://example.com/`,
    collateralMint: SOL_MINT,
    collateralAmount: Math.floor(randAmount() * 10 ** 8),
    price: priceD,
    globalStatePubkey: globalState,
    globalStateAuthority: seller.publicKey,
    program: solxProgram,
  });
  await purchaseListing({
    connection,
    payer: buyer,
    uuid: uuidD,
    paymentMint: SOL_MINT,
    globalStatePubkey: globalState,
    program: solxProgram,
  });

  console.log(`d) [${uuidD}] purchased, waiting`);
  await sleep(70000);
  await closeListing({
    connection,
    payer: seller,
    uuid: uuidD,
    globalState,
    collateralMint: SOL_MINT,
    paymentMint: SOL_MINT,
    treasury,
    program: solxProgram,
  });
  console.log(`d) [${uuidD}] closed`);
}

export async function sendSol(
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  amountSol: number,
): Promise<string> {
  const transferIx = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient,
    lamports: amountSol,
  });

  const tx = new Transaction().add(transferIx);

  const sig = await sendAndConfirmTransaction(connection, tx, [sender], {
    commitment: 'confirmed',
  });

  console.log(
    `Sent ${amountSol} SOL from ${sender.publicKey.toBase58()} to ${recipient.toBase58()}:`,
    sig,
  );
  return sig;
}
