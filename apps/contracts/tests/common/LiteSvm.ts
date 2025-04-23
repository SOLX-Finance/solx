import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { LiteSVM } from 'litesvm';
import { PublicKey } from '@solana/web3.js';

export class LiteSvmProgram<Idl> extends Program<anchor.Idl> {
  svm: LiteSVM;

  constructor(idl: anchor.Idl, programId: PublicKey, svm: LiteSVM) {
    super(idl, programId);
    this.svm = svm;
  }

  liteProgram(): Program<anchor.Idl> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    let originalAccountGetter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(this),
      'account',
    )?.get;

    if (!originalAccountGetter) {
      const baseAccount = this.account;
      originalAccountGetter = () => baseAccount;
    }

    const customProgram = Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    ) as Program<anchor.Idl>;

    Object.defineProperty(customProgram, 'account', {
      configurable: true,
      enumerable: true,
      get: function () {
        const baseAccount = originalAccountGetter.call(this);

        return new Proxy(baseAccount, {
          get: (target, prop, receiver) => {
            if (typeof prop === 'string') {
              return {
                fetch: async (pubkey: PublicKey) => {
                  const acc = self.svm.getAccount(pubkey);
                  if (!acc || !acc.data) {
                    throw new Error(`Account ${pubkey.toBase58()} not found`);
                  }
                  return self.coder.accounts.decode(
                    prop,
                    Buffer.from(acc.data),
                  );
                },
              };
            }
            return Reflect.get(target, prop, receiver);
          },
        });
      },
    });

    return customProgram;
  }
}
