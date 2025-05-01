import * as z from 'zod';

export const ANALYZE_FILE_QUEUE = {
  name: '{analyze-file}',
  payloadSchema: z.object({
    fileId: z.string(),
  }),
  jobOptions: {
    attempts: 30,
    backoff: { type: 'fixed', delay: 10000 },
    removeOnComplete: {
      count: 1000,
    },
    removeOnFail: {
      count: 5000,
    },
  },
} as const;

export type AnalyzeFilePayload = z.infer<
  typeof ANALYZE_FILE_QUEUE.payloadSchema
>;
