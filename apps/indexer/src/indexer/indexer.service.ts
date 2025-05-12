import * as anchor from '@coral-xyz/anchor';
import { IdlEvent } from '@coral-xyz/anchor/dist/cjs/idl';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Network, Prisma } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import { PrismaService } from '@solx/data-access';
import { INDEXED_TRANSACTION_QUEUE, IndexerCommonData } from '@solx/queues';
import { Queue } from 'bullmq';
import { z } from 'zod';

import { IndexerEvent } from './events';
import { EventWithTimestampAndIndex } from './events/common';
import { getEventHandler } from './handlers';
import { CommonHandleParams } from './handlers/common';
import { Solx, SolxIDL } from './idls/solx.idl';
import {
  BorshCoderWithEventEncoder,
  EventParserWithErrorHandling,
} from './utils';

import { NetworkAddresses, networkAddresses } from '../config/constants';
import { ProvidersService } from '../provider/providers.service';
import { delay } from '../utils';

const second = 1000;

export class IndexerConfig {
  loopCycleDelay: number;
  environment: 'devnet' | 'mainnet';
}

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);

  private readonly eventsToIndex: IndexerEvent['name'][] = [
    'listingCreated',
    'disputeResolved',
    'listingClosed',
    'listingDisputed',
    'listingPurchased',
  ];

  private readonly customEventsToIndex: string[] = [];

  public constructor(
    private readonly dbService: PrismaService,
    protected readonly providers: ProvidersService,
    protected readonly indexerConfig: IndexerConfig,
    @InjectQueue(INDEXED_TRANSACTION_QUEUE.name)
    private indexedTxQueue: Queue<
      z.infer<typeof INDEXED_TRANSACTION_QUEUE.payloadSchema>
    >,
  ) {}

  onModuleInit() {
    this.start().catch((err: Error) => {
      this.logger.error(
        `Indexer failed with an error ${err.name}: ${err.message}`,
        err.stack,
      );

      // TODO: any better way?
      process.kill(process.pid, 'SIGTERM');
    });
  }

  private async start() {
    await this.observeLoop(async () => {
      return Promise.allSettled([this.loopCycle.bind(this)()]).then(
        (v) => v[0],
      );
    }, this.indexerConfig.loopCycleDelay);
  }

  private async loopCycle() {
    const networkId = `solana-${this.indexerConfig.environment}`;

    let networkEntity = await this.dbService.network.upsert({
      where: { id: networkId },
      create: { id: networkId },
      update: {},
    });

    const { lastBlock, parsedEvents } = await this.getPastEvents(networkEntity);

    await this.dbService.$transaction(async (prisma) => {
      networkEntity = await prisma.network.update({
        where: {
          id: networkId,
        },
        data: {
          lastIndexedId: lastBlock?.toString(),
        },
      });

      if (!parsedEvents.length) {
        return;
      }
      this.logger.debug(`Processing ${parsedEvents.length} events`);

      const toNotifyEvents = await this.processEvents(
        this.providers.getProvider(),
        prisma,
        networkEntity,
        parsedEvents,
      );

      this.logger.log(`Successfully processed ${parsedEvents.length} events`);

      if (!toNotifyEvents?.events) return;

      await this.indexedTxQueue.addBulk(
        toNotifyEvents.events.map((data) => {
          return {
            name: INDEXED_TRANSACTION_QUEUE.name,
            data,
          };
        }),
      );

      this.logger.log(
        `Successfully notified ${toNotifyEvents.events.length} events`,
      );
    });
  }

  private async getPastEvents(network: Network) {
    const connection = this.providers.getProvider();

    const lastFetchedTxRecorded = network?.lastIndexedId;

    const { lastFetchedTx, parsedEvents } = await this.fetchEvents(
      connection,
      lastFetchedTxRecorded,
    );

    return { lastBlock: lastFetchedTx, parsedEvents };
  }

  private async fetchEvents(
    provider: ReturnType<typeof this.providers.getProvider>,
    lastTxSignature?: string,
  ) {
    const addresses = networkAddresses[this.indexerConfig.environment];

    console.log({ addresses, f: this.indexerConfig.environment });
    const programs = [
      new anchor.Program<Solx>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        SolxIDL as any,
        addresses.programs.solx,
        new anchor.AnchorProvider(
          provider,
          new anchor.Wallet(anchor.web3.Keypair.generate()),
          {
            commitment: 'finalized',
          },
        ),
      ),
    ];

    const accountsToFetch = [
      ...programs.map((program) => program.programId),
      // TODO: uncomment when need to index mToken transfers
      // addresses.mTBILL?.mToken,
    ].filter((v) => !!v);

    const parsedTxs = await this.fetchTransactionsPaginated(
      provider,
      accountsToFetch,
      lastTxSignature,
    );

    const coders = programs.map(
      (program) => new BorshCoderWithEventEncoder(program.idl),
    );

    const eventParsers = programs.map(
      (program, i) =>
        new EventParserWithErrorHandling(program.programId, coders[i]),
    );

    const allEvents: EventWithTimestampAndIndex[] = [];

    const pushEvent = <TEvent extends EventWithTimestampAndIndex>(
      tx: anchor.web3.ParsedTransactionWithMeta & { signature: string },
      event: anchor.Event<IdlEvent, Record<string, never>> & {
        logIndex: number;
        programId: PublicKey;
      },
      evName: IndexerEvent['name'],
    ) => {
      if (event.name !== evName) return;

      const data = {
        ...event.data,
        eventIndex: event.logIndex,
        name: event.name,
        timestamp: tx.blockTime ?? 0,
        txHash: tx.signature,
        program: event.programId,
      };

      allEvents.push(data as unknown as TEvent);
    };

    for (const parsedTx of parsedTxs) {
      const events = eventParsers
        .map((eventParser, i) =>
          [
            ...eventParser.parseLogs(parsedTx.meta?.logMessages ?? [], false),
          ].map((event) => {
            const coder = coders[i];
            const encodedEvent = coder.events.encode(event);
            const logIndex = parsedTx.meta?.logMessages.findIndex((log) =>
              log.includes(encodedEvent),
            );

            if (logIndex === -1) {
              throw new Error('Log index not found');
            }

            return {
              ...event,
              programId: eventParser.programIdPubkey,
              logIndex,
            };
          }),
        )
        .flat(2);

      events.forEach((ev) => {
        this.eventsToIndex.forEach((evName) => pushEvent(parsedTx, ev, evName));
      });
    }

    const allEventsSorted = allEvents.sort((a, b) => {
      const timestampDiff = a.timestamp - b.timestamp;

      if (timestampDiff !== 0) {
        return timestampDiff;
      }

      const indexDiff = a.eventIndex - b.eventIndex;

      return indexDiff;
    });

    return {
      lastFetchedTx: parsedTxs?.[0]?.signature,
      parsedEvents: this.filterEventsWithDesiredAccounts(
        addresses,
        allEventsSorted as IndexerEvent[],
      ),
    };
  }

  private filterEventsWithDesiredAccounts(
    addresses: NetworkAddresses,
    events: IndexerEvent[],
  ) {
    const desiredGlobalStates = Object.values(addresses.globalStates);

    return events.filter((ev) => {
      if (desiredGlobalStates.find((v) => v.equals(ev.globalState)))
        return true;

      return false;
    });
  }

  private async fetchTransactionsPaginated(
    connection: ReturnType<typeof this.providers.getProvider>,
    accounts: PublicKey[],
    lastTxSignature?: string,
  ) {
    const txs: (anchor.web3.ParsedTransactionWithMeta & {
      signature: string;
    })[] = [];
    const fromTx: (anchor.web3.ConfirmedSignatureInfo | undefined)[] = [];
    const shouldFetch = accounts.map(() => true);

    do {
      const transactionsByAccount = await Promise.all(
        accounts.map((account, i) =>
          shouldFetch[i]
            ? connection.getSignaturesForAddress(
                account,
                {
                  until: lastTxSignature,
                  before: fromTx[i]?.signature,
                },
                'finalized',
              )
            : Promise.resolve<anchor.web3.ConfirmedSignatureInfo[]>([]),
        ),
      );

      const uniqueSignatures: Set<string> = new Set();

      for (let i = 0; i < transactionsByAccount.length; i++) {
        const transactions = transactionsByAccount[i];

        for (const { signature } of transactions.filter((v) => !v.err)) {
          if (uniqueSignatures.has(signature)) continue;

          uniqueSignatures.add(signature);

          const parsedTx = await connection.getParsedTransaction(
            signature,
            'finalized',
          );
          if (parsedTx) txs.push({ ...parsedTx, signature });
        }

        if (transactions.length < 1000) {
          shouldFetch[i] = false;
        }

        fromTx[i] = transactions[transactions.length - 1];
      }
      const shouldBreak = shouldFetch.every((v) => !v);

      if (shouldBreak) break;

      // eslint-disable-next-line no-constant-condition
    } while (true);

    return txs.sort((a, b) => b.slot - a.slot);
  }

  private async observeLoop(
    fn: () => Promise<PromiseSettledResult<unknown>>,
    delayMs: number,
  ) {
    do {
      const results = await fn.bind(this)();

      if (results.status == 'rejected') {
        // FIXME: throw the error
        this.logger.error(`Rejected: ${results.reason}`);
      }

      if (delayMs > 0) {
        this.logger?.debug?.(`Delaying ${delayMs / second}s`);
        await delay(delayMs);
      }
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  private async processEvents(
    connection: ReturnType<typeof this.providers.getProvider>,
    prisma: Prisma.TransactionClient,
    network: Network,
    events: IndexerEvent[],
  ) {
    const commonHandlerParams: CommonHandleParams = {
      connection,
      dbClient: prisma,
      networkAddresses: this.getNetworkAddresses(),
      env: this.indexerConfig.environment,
      network,
    };

    const indexTxDataToLogArr: {
      commonData: IndexerCommonData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
    }[] = [];

    for (const event of events) {
      const handler = getEventHandler(event);

      if (!handler) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.logger.log(`Event ${(event as any).name} was skipped`);
        continue;
      }

      const indexTxDataToLog = await handler(commonHandlerParams, event);

      this.logger.log(`Event ${event.name} was processed`);

      indexTxDataToLogArr.push({
        data: indexTxDataToLog.customData,
        commonData: {
          txType: indexTxDataToLog.txType,
          txCaller: indexTxDataToLog.signer?.toBase58?.(),
          txHash: event.txHash,
          logIndex: event.eventIndex.toString(),
          network: network.id,
          txTimestamp: event.timestamp,
        },
      });
    }

    return {
      events: indexTxDataToLogArr.filter((v) => v.commonData.txType),
    };
  }

  getNetworkAddresses() {
    const addresses = networkAddresses[this.indexerConfig.environment];

    if (!addresses) {
      throw new Error(
        'Network addresses for a given environment are not found',
      );
    }

    return addresses;
  }
}
