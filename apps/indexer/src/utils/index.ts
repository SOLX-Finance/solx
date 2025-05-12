import { BN } from '@coral-xyz/anchor';
import { formatUnits, parseUnits } from 'viem';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const fromBN = (bn: BN) => {
  return BigInt(bn.toString());
};

export const toBN = (bigint: bigint | string) => {
  return new BN(bigint.toString());
};

export const convertFromBase9ToBase18 = (value: string | bigint) => {
  return parseUnits(formatUnits(BigInt(value), 9), 18);
};
