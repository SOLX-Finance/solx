import {
  SaleClosedData,
  SaleCreatedData,
  SalePurchasedData,
} from '@solx/queues';

import { CommonHandleParams, HandlerFunction } from './common';

import {
  ListingClosedEvent,
  ListingCreatedEvent,
  ListingPurchasedEvent,
} from '../events/solx.events';

export const handleListingCreated: HandlerFunction<
  ListingCreatedEvent,
  SaleCreatedData
> = async (common: CommonHandleParams, ev: ListingCreatedEvent) => {
  return {
    txType: 'listing-created',
    signer: ev.buyer,
    customData: {
      globalState: ev.globalState.toBase58(),
      listing: ev.listing.toBase58(),
      nft: ev.nft.toBase58(),
      buyer: ev.buyer.toBase58(),
      id: ev.id.toString(),
      collateralMint: ev.collateralMint.toBase58(),
      collateralAmount: ev.collateralAmount.toString(),
      priceUsd: ev.priceUsd.toString(),
    },
  };
};

export const handleListingPurchased: HandlerFunction<
  ListingPurchasedEvent,
  SalePurchasedData
> = async (common: CommonHandleParams, ev: ListingPurchasedEvent) => {
  return {
    txType: 'listing-purchased',
    signer: ev.buyer,
    customData: {
      id: ev.id.toString(),
      globalState: ev.globalState.toBase58(),
      listing: ev.listing.toBase58(),
      nft: ev.nft.toBase58(),
      buyer: ev.buyer.toBase58(),
      paymentMint: ev.paymentMint.toBase58(),
      paymentAmount: ev.paymentAmount.toString(),
      disputePeriodExpiryTs: ev.disputePeriodExpiryTs.toString(),
    },
  };
};

export const handleListingClosed: HandlerFunction<
  ListingClosedEvent,
  SaleClosedData
> = async (common: CommonHandleParams, ev: ListingClosedEvent) => {
  return {
    txType: 'listing-closed',
    customData: {
      id: ev.id.toString(),
      globalState: ev.globalState.toBase58(),
      listing: ev.listing.toBase58(),
      nft: ev.nft.toBase58(),
    },
  };
};
