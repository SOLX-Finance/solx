import { HandlerFunction } from './common';
import {
  handleListingClosed,
  handleListingCreated,
  handleListingPurchased,
} from './solx';

import { IndexerEvent } from '../events';

export const eventHandlers: Record<
  IndexerEvent['name'],
  HandlerFunction<IndexerEvent> | undefined
> = {
  listingCreated: handleListingCreated,
  listingClosed: handleListingClosed,
  listingPurchased: handleListingPurchased,
  listingDisputed: undefined,
  disputeResolved: undefined,
};

export const getEventHandler = <TEv extends IndexerEvent>(
  ev: TEv,
): HandlerFunction<TEv> | undefined => {
  return eventHandlers[ev.name] as HandlerFunction<TEv> | undefined;
};
