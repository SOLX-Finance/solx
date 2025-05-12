import * as anchor from '@coral-xyz/anchor';
import { Network, Prisma } from '@prisma/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { IndexerCommonData } from '@solx/queues';
import { keccak256 } from 'viem';

import { NetworkAddresses } from '../../config/constants';

export type CommonHandleParams = {
  connection: Connection;
  dbClient: Prisma.TransactionClient;
  networkAddresses: NetworkAddresses;
  network: Network;
  env: 'devnet' | 'mainnet';
};

export type HandlerFunction<TEv, TCustomData = object> = (
  common: CommonHandleParams,
  ev: TEv,
) => Promise<{
  txType?: IndexerCommonData['txType'];
  signer?: PublicKey;
  customData?: TCustomData;
}>;

// removes common values from the db entity
// to be later pushed to the queue and logged to slack/tg/etc
export const removeCommonProps = <TObj extends object>(
  entity: TObj,
  extraKeysToRemove: (keyof TObj)[] = [],
) => {
  delete entity['id'];
  delete entity['networkId'];
  delete entity['createdAt'];
  delete entity['updatedAt'];

  extraKeysToRemove.forEach((key) => {
    delete entity[key];
  });

  return entity;
};

export const constructEntityId = (
  baseIds: (string | bigint | number | anchor.BN | anchor.web3.PublicKey)[],
  env: 'devnet' | 'mainnet',
) => {
  const id =
    baseIds.reduce((prev, baseId) => {
      return (
        prev +
        ((baseId as anchor.web3.PublicKey)?.toBase58?.() ?? baseId.toString())
      );
    }, '') + `solana-${env}`;

  return keccak256(Uint8Array.from(Buffer.from(id)));
};
