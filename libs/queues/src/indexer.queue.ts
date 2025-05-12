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

export const INDEXED_TRANSACTION_QUEUE = {
  name: '{indexed-transaction}',
  payloadSchema: z.object({
    commonData: commonDataSchema,
    data: z.unknown(),
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

export type TxType = z.infer<typeof txTypeEnum>;
export type IndexerCommonData = z.infer<typeof commonDataSchema>;
