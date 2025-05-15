import * as z from 'zod';

const txTypeEnum = z.enum([
  'listing-created',
  'listing-purchased',
  'listing-disputed',
  'listing-closed',
  'listing-dispute-resolved',
]);

export const commonDataSchema = z.object({
  txHash: z.string(),
  network: z.string(),
  txTimestamp: z.number(),
  logIndex: z.string(),
  txType: txTypeEnum.optional(),
  txCaller: z.string(),
});

export const saleCreatedDataSchema = z.object({
  globalState: z.string(),
  listing: z.string(),
  nft: z.string(),
  buyer: z.string(),
  id: z.string(),
  collateralMint: z.string(),
  collateralAmount: z.string(),
  priceUsd: z.string(),
});

export const salePurchasedDataSchema = z.object({
  id: z.string(),
  globalState: z.string(),
  listing: z.string(),
  nft: z.string(),
  buyer: z.string(),
  paymentMint: z.string(),
  paymentAmount: z.string(),
  disputePeriodExpiryTs: z.string(),
});

export const saleClosedDataSchema = z.object({
  id: z.string(),
  globalState: z.string(),
  listing: z.string(),
  nft: z.string(),
});

export const INDEXED_TRANSACTION_QUEUE = {
  name: '{indexed-transaction}',
  payloadSchema: z.object({
    commonData: commonDataSchema,
    data: z.union([
      saleCreatedDataSchema,
      salePurchasedDataSchema,
      saleClosedDataSchema,
    ]),
  }),
  jobOptions: {
    attempts: 5,
    backoff: { type: 'fixed', delay: 10000 },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
} as const;

export type SaleCreatedData = z.infer<typeof saleCreatedDataSchema>;
export type SalePurchasedData = z.infer<typeof salePurchasedDataSchema>;
export type SaleClosedData = z.infer<typeof saleClosedDataSchema>;

export type TxType = z.infer<typeof txTypeEnum>;
export type IndexerCommonData = z.infer<typeof commonDataSchema>;

export type IndexedTransactionPayload = z.infer<
  typeof INDEXED_TRANSACTION_QUEUE.payloadSchema
>;
