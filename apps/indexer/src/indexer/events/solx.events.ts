import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { EventWithTimestampAndIndex } from './common';

export type ListingCreatedEvent = {
  name: 'listingCreated';
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  buyer: PublicKey;
  id: BN;
  collateralMint: PublicKey;
  collateralAmount: BN;
  priceUsd: BN;
} & EventWithTimestampAndIndex;

export type ListingPurchasedEvent = {
  name: 'listingPurchased';
  id: BN;
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  buyer: PublicKey;
  paymentMint: PublicKey;
  paymentAmount: BN;
  disputePeriodExpiryTs: BN;
} & EventWithTimestampAndIndex;

export type ListingClosedEvent = {
  name: 'listingClosed';
  globalState: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  id: BN;
} & EventWithTimestampAndIndex;

export type ListingDisputedEvent = {
  name: 'listingDisputed';
  globalState: PublicKey;
  initiator: PublicKey;
  listing: PublicKey;
  nft: PublicKey;
  id: BN;
} & EventWithTimestampAndIndex;

export type DisputeResolvedEvent = {
  name: 'disputeResolved';
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
