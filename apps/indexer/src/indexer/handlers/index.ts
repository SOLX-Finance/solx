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
  ListingCreated: handleListingCreated,
  ListingClosed: handleListingClosed,
  ListingPurchased: handleListingPurchased,
  ListingDisputed: undefined,
  DisputeResolved: undefined,
};

export const getEventHandler = <TEv extends IndexerEvent>(
  ev: TEv,
): HandlerFunction<TEv> | undefined => {
  return eventHandlers[ev.name] as HandlerFunction<TEv> | undefined;
};
