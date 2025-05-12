import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@solx/data-access';
import {
  IndexedTransactionPayload,
  INDEXED_TRANSACTION_QUEUE,
  SaleCreatedData,
  SalePurchasedData,
  SaleClosedData,
} from '@solx/queues';
import { Job } from 'bullmq';
import { keccak256 } from 'viem';

import { FileAnalyzerService } from '../file-analyzer/file-analyzer.service';

@Processor(INDEXED_TRANSACTION_QUEUE.name)
export class IndexerProcessor extends WorkerHost {
  private readonly logger = new Logger(IndexerProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileAnalyzer: FileAnalyzerService,
  ) {
    super();
  }

  async process(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    job: Job<IndexedTransactionPayload, any, string>,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const { commonData, data } = job.data;

      const actionId = this._getIndexedContractAction(commonData);
      const indexedContractAction = await tx.indexedContractAction.findFirst({
        where: {
          id: actionId,
        },
      });

      if (indexedContractAction) {
        this.logger.debug('Log already indexed', job);
        return;
      }

      switch (commonData.txType) {
        case 'listing-created':
          await this.handleSaleCreated(data, tx);
          break;
        case 'listing-purchased':
          await this.handleSalePurchased(data, tx);
          break;
        case 'listing-closed':
          await this.handleSaleClosed(data, tx);
          break;
        default:
          break;
      }

      await tx.indexedContractAction.create({
        data: {
          actionId: actionId,
        },
      });
    });
  }

  async handleSaleCreated(data: SaleCreatedData, tx: Prisma.TransactionClient) {
    const file = await tx.file.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    await tx.sale.create({
      data: {
        listingId: data.id,
        listing: data.listing,
        nftMint: data.nft,
        buyer: data.buyer,
        collateralMint: data.collateralMint,
        collateralAmount: data.collateralAmount,
        priceUsd: data.priceUsd,
        fileId: file.id,
      },
    });
  }

  async handleSalePurchased(
    data: SalePurchasedData,
    tx: Prisma.TransactionClient,
  ) {
    const file = await tx.file.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    const user = await tx.user.findFirst({
      where: {
        walletAddress: data.buyer,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await tx.file.update({
      where: {
        id: file.id,
      },
      data: {
        userId: user.id,
      },
    });
  }

  async handleSaleClosed(data: SaleClosedData, _: Prisma.TransactionClient) {
    this.logger.log('Closed sale received', data);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    const { id, name, queueName, failedReason, attemptsMade, opts } = job;

    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}. Attempt ${attemptsMade}/${opts.attempts}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }

  private _getIndexedContractAction(
    event: IndexedTransactionPayload['commonData'],
  ) {
    return keccak256(
      Buffer.from(
        `${event.txHash}-${event.logIndex}-${event.txType}`,
      ) as Uint8Array,
    );
  }
}
