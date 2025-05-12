import { CommonHandleParams, HandlerFunction } from './common';

import {
  ListingClosedEvent,
  ListingCreatedEvent,
  ListingPurchasedEvent,
} from '../events/solx.events';

export const handleListingCreated: HandlerFunction<
  ListingCreatedEvent
> = async (common: CommonHandleParams, ev: ListingCreatedEvent) => {
  return {
    txType: 'listing-created',
    signer: ev.buyer,
    customData: ev,
  };
};

export const handleListingPurchased: HandlerFunction<
  ListingPurchasedEvent
> = async (common: CommonHandleParams, ev: ListingPurchasedEvent) => {
  return {
    txType: 'listing-purchased',
    signer: ev.buyer,
    customData: ev,
  };
};

export const handleListingClosed: HandlerFunction<ListingClosedEvent> = async (
  common: CommonHandleParams,
  ev: ListingClosedEvent,
) => {
  return {
    txType: 'listing-closed',
    // signer: ev.``,
    customData: ev,
  };
};
