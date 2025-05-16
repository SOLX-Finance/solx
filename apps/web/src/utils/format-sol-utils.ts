export function formatUnits(
  amount: number | bigint | string,
  decimals = 9,
): string {
  if (typeof amount === 'string') {
    amount = BigInt(amount);
  }

  const divisor = BigInt(10 ** decimals);

  if (typeof amount === 'number') {
    return (amount / Number(divisor)).toString();
  } else {
    const integerPart = amount / divisor;
    const fractionalPart = amount % divisor;

    if (fractionalPart === BigInt(0)) {
      return integerPart.toString();
    }

    // Format fractional part with leading zeros
    let fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    // Remove trailing zeros
    fractionalStr = fractionalStr.replace(/0+$/, '');

    return `${integerPart}.${fractionalStr}`;
  }
}
