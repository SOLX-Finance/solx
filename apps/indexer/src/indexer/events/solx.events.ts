import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { EventWithTimestampAndIndex } from './common';

export type ListingCreatedEvent = {
  name: 'ListingCreated';
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  buyer: PublicKey;
  id: string;
  collateralMint: PublicKey;
  collateralAmount: BN;
  priceUsd: BN;
} & EventWithTimestampAndIndex;

export type ListingPurchasedEvent = {
  name: 'ListingPurchased';
  id: string;
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  buyer: PublicKey;
  paymentMint: PublicKey;
  paymentAmount: BN;
  disputePeriodExpiryTs: BN;
} & EventWithTimestampAndIndex;

export type ListingClosedEvent = {
  name: 'ListingClosed';
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  id: string;
} & EventWithTimestampAndIndex;

export type ListingDisputedEvent = {
  name: 'ListingDisputed';
  globalState: PublicKey;
  initiator: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  id: string;
} & EventWithTimestampAndIndex;

export type DisputeResolvedEvent = {
  name: 'DisputeResolved';
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  id: BN;
  verdict: 'BuyerFault' | 'SellerFault' | 'Refund';
} & EventWithTimestampAndIndex;

export type SolxEvent =
  | ListingCreatedEvent
  | ListingPurchasedEvent
  | ListingClosedEvent
  | ListingDisputedEvent
  | DisputeResolvedEvent;
