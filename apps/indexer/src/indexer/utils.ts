import {
  Coder,
  EventParser,
  Idl,
  BorshEventCoder,
  BorshCoder,
  AccountsCoder,
  EventCoder,
  InstructionCoder,
  TypesCoder,
} from '@coral-xyz/anchor';
import { base64 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';
import { Layout } from 'buffer-layout';

export const DEFAULT_PUBKEY = new PublicKey(0);

interface EventCoderWithEncoder extends EventCoder {
  encode: <TEv extends { name: string; data: Record<string, unknown> }>(
    event: TEv,
  ) => string | null;
}

export class BorshCoderWithEventEncoder<
  A extends string = string,
  T extends string = string,
> implements Coder<A, T>
{
  private readonly baseCoder: BorshCoder;

  events: EventCoderWithEncoder;

  constructor(idl: Idl) {
    this.baseCoder = new BorshCoder(idl);
    this.events = new BorshEventCoderWithEventEncoder(idl);
  }

  get instruction(): InstructionCoder {
    return this.baseCoder.instruction;
  }

  get accounts(): AccountsCoder<A> {
    return this.baseCoder.accounts;
  }

  get types(): TypesCoder<T> {
    return this.baseCoder.types;
  }
}

export class BorshEventCoderWithEventEncoder
  extends BorshEventCoder
  implements EventCoderWithEncoder
{
  private readonly layoutsCopy: Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { discriminator: any; layout: Layout }
  >;

  constructor(idl: Idl) {
    super(idl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.layoutsCopy = (this as any).layouts;
  }

  public encode<TEv extends { name: string; data: Record<string, unknown> }>(
    log: TEv,
  ): string | null {
    let buffer: Buffer = Buffer.alloc(1000);

    const layout = this.layoutsCopy.get(log.name);

    if (!layout) {
      throw new Error(`Unknown type: ${name}`);
    }

    const len = layout.layout.encode(log.data, buffer);

    buffer = buffer.slice(0, len);

    // Combine discriminator and encoded data
    buffer = Buffer.concat([
      Buffer.from(layout.discriminator), // Prepend the discriminator
      buffer, // Add the encoded data
    ]);

    return base64.encode(buffer);
  }
}

export class EventParserWithErrorHandling extends EventParser {
  constructor(
    private readonly _programId: PublicKey,
    coder: Coder,
  ) {
    super(_programId, coder);

    const origDecode = coder.events.decode;

    // decode throws the error due to which we cant process events that
    // are invalid for some reasons (for example contract is upgraded and event body is changed)
    // so we override decode function and add try catch to catch such errors
    coder.events.decode = (param: string) => {
      try {
        return origDecode.call(coder.events, param);
      } catch (err) {
        if (
          err.toString().includes('Invalid option') ||
          err.toString().includes('ERR_OUT_OF_RANGE')
        ) {
          return null;
        }

        throw err;
      }
    };
  }

  get programIdPubkey() {
    return this._programId;
  }
}
