import BigNumber from 'bignumber.js';

export const getDecimalsNumber = (decimal: number) => {
  let output = '1';
  for (let i = 0; i < decimal; i++) {
    output += '0';
  }

  return new BigNumber(output).toNumber();
};

export function formatDisplayWallet(wallet: string, count = 8) {
  const textLength = wallet.length;
  const splitCount = count / 2;
  if (textLength > count) {
    return (
      wallet.slice(0, splitCount) +
      '...' +
      wallet.slice(textLength - splitCount, textLength)
    );
  }

  return wallet;
}

const SOL_AMOUNT_DIVIDER = 1000000000;

const formatAmountInDecimal = (amount: BigNumber, decimalSpace = 9) => {
  return new Intl.NumberFormat('en-EN', {
    maximumFractionDigits: decimalSpace
  }).format(amount.toNumber());
};

export type FormatAmountType = {
  raw: number;
  parser: BigNumber;
  parserNumber: number;
  parserString: string;
  format: string;
};

export function formatAmount(
  amount: number | BigNumber,
  dividerIn = SOL_AMOUNT_DIVIDER
): FormatAmountType {
  const parser =
    amount instanceof BigNumber ? amount : new BigNumber(amount as number);

  const parseString = formatAmountInDecimal(parser.dividedBy(dividerIn));

  return {
    raw: typeof amount === 'number' ? amount : parser.toNumber(),
    parser: parser.dividedBy(dividerIn),
    parserNumber: parser.dividedBy(dividerIn).toNumber(),
    parserString: parseString,
    format: parseString + ' SOL'
  };
}

export function formatAmountInMoney(
  amount: number,
  decimalSpace = 8,
  dividerIn = SOL_AMOUNT_DIVIDER
) {
  const { parser } = formatAmount(amount, dividerIn);
  return formatAmountInDecimal(parser, decimalSpace);
}

export function formatMoney(
  amount: number | string,
  decimalSpace: number | 'auto' = 2,
  isAbsolute: boolean = true
) {
  let value = new BigNumber(amount);
  if (value.isNaN()) return '-';
  if (value.isZero()) return '0.00';

  if (isAbsolute) {
    value = value.toNumber() < 0 ? value.multipliedBy(-1) : value;
  }

  if (decimalSpace === 'auto') {
    const [entire, decimal] = value.toFixed(8).split('.');
    const decimalIsMoreThanTwo = decimal.charAt(2) !== '0';
    return formatAmountInDecimal(value, decimalIsMoreThanTwo ? 8 : 2);
  }
  return formatAmountInDecimal(value, decimalSpace);
}

export function formatMiles(amount: number | string, digits = 1) {
  const value = new BigNumber(amount);

  if (value.isNaN()) return '0';

  if (value.gte(1000)) return `${value.dividedBy(1000).toFixed(digits)}K`;
  if (value.lte(1000000)) return `${value.dividedBy(1000000).toFixed(digits)}M`;
  return value.toFixed(digits);
}
