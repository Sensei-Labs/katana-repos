import BigNumber from 'bignumber.js';

import { formatDateUnixToISO } from './date';
import {
  TransactionDBType,
  TransactionFacadeType,
  TransactionSolscanSPLType,
  TransactionSolscanType
} from '../api/transaction/types';
import { DEFAULT_IMAGE_SOLANA } from '../config';
import { CurrencyEnum, TokenNameEnum, TypeReturnEnum } from '../../@types/currencyEnums';
import { TreasuryAccountType } from '../api/treasury-address/types';
import { TOKEN_ADDRESS_VALID_LIST } from '../stores/constants';
import { DiscordGuildPartialInfo } from '../api/discord/types';
import { StatusProjectEnum, TreasuryDBType } from '../api/treasury/types';
import { clearArray } from './index';

const SOL_DECIMAL_VALUE = 1000000000;
const SOL_DECIMAL_INPUT = 9;
const USDC_DECIMAL_INPUT = 6;

const getDecimalsNumber = (decimal: number) => {
  let output = '1';
  for (let i = 0; i < decimal; i++) {
    output += '0';
  }

  return new BigNumber(output).toNumber();
};

export function formatAmount(amount, divider = SOL_DECIMAL_VALUE) {
  return new BigNumber(amount).dividedBy(divider || 0).toNumber();
}

const getAmount = (amount: number | string | null, onlyPositive = false) => {
  const instance = new BigNumber(amount);
  if (instance.isNegative() && onlyPositive) return instance.multipliedBy(-1).toNumber();
  return instance.toNumber();
};

const getAmountFormatted = ({
  amount,
  symbol,
  decimalInput,
  decimalsOutput = 2
}: {
  amount: number;
  decimalInput: number;
  symbol: string;
  decimalsOutput?: number;
}) => {
  const divider = getDecimalsNumber(decimalInput);
  const amountFormatted = formatAmount(amount, divider);
  const amountFixed = amountFormatted.toFixed(decimalsOutput);

  return {
    symbol,
    original: amount,
    amount: amountFormatted,
    format: amountFixed
  };
};

export function formatTransactionsFromSolana(
  transactions: TransactionSolscanType[],
  _account: TreasuryAccountType = null
): TransactionFacadeType[] {
  return transactions.map((transaction) => {
    const account = _account;
    const isReceived = transaction?.dst === account?.address;

    const amount = getAmount(
      isReceived ? transaction?.lamport : new BigNumber(transaction?.lamport).multipliedBy(-1).toNumber(),
      true
    );
    const amountFormatted = getAmountFormatted({
      amount,
      symbol: 'SOL',
      decimalInput: transaction.decimals || SOL_DECIMAL_INPUT
    });

    return {
      amount,
      amountFormatted: {
        ...amountFormatted,
        amountInSol: amountFormatted.amount,
        usd: 0
      },
      decimals: transaction?.decimals,
      symbol: 'SOL',
      tokenIcon: DEFAULT_IMAGE_SOLANA,
      tokenName: TokenNameEnum.SOLANA,
      walletAddressTrackId: account?.id,
      toUserAccount: transaction?.dst,
      fromUserAccount: transaction?.src || account.address,
      date: formatDateUnixToISO(transaction?.blockTime),
      signature: transaction?.txHash,
      idSolscan: transaction?._id,
      direction: isReceived ? 'IN' : 'OUT',
      walletAddressTrack: null
    };
  });
}

export function formatTransactionsFromSPLTokens(
  transactions: TransactionSolscanSPLType[],
  _account: TreasuryAccountType = null,
  strapi
): TransactionFacadeType[] {
  const pricingServer = strapi?.princingServer;

  return transactions.map((transaction) => {
    const account = _account;
    const isOutput = transaction?.changeAmount < 0;

    const isUSDC = transaction.symbol.toUpperCase() === CurrencyEnum.USDC;
    const currentSOLPrice = pricingServer?.getPrice(CurrencyEnum.SOL) || 0;

    const amount = getAmount(transaction.changeAmount);
    const amountFormatted = getAmountFormatted({
      amount,
      symbol: transaction.symbol,
      decimalInput: transaction.decimals || USDC_DECIMAL_INPUT
    });

    return {
      amount,
      amountFormatted: {
        ...amountFormatted,
        amountInSol: isUSDC
          ? new BigNumber(amountFormatted.amount).dividedBy(currentSOLPrice).toNumber()
          : amountFormatted.amount,
        usd: 0
      },
      walletAddressTrackId: account?.id,
      decimals: transaction?.decimals,
      symbol: transaction?.symbol,
      tokenName: TokenNameEnum.USDC,
      toUserAccount: transaction?.owner,
      fromUserAccount: account.address,
      date: formatDateUnixToISO(transaction?.blockTime),
      tokenIcon: TOKEN_ADDRESS_VALID_LIST?.[transaction.tokenAddress]?.tokenIcon,
      signature: transaction?.signature?.length ? transaction?.signature[0] : '',
      idSolscan: transaction?._id,
      direction: !isOutput ? 'IN' : 'OUT',
      walletAddressTrack: null
    };
  });
}

export function formatTransactionsFromDB(
  transactions: TransactionDBType[],
  strapi,
  type: TypeReturnEnum = TypeReturnEnum.COMPLETED
): TransactionFacadeType[] {
  const pricingServer = strapi?.princingServer;

  return transactions.map((transaction) => {
    const account = transaction?.walletAddressTrack;
    const isFiatToken = transaction.symbol === CurrencyEnum.USDC;

    const amount = getAmount(transaction.amount);
    const amountFormatted = getAmountFormatted({
      amount,
      symbol: transaction?.symbol,
      decimalInput: transaction.decimals
    });

    const currentAssetPrice = pricingServer?.getPrice(transaction?.symbol) || 0;
    const currentSOLPrice = pricingServer?.getPrice(CurrencyEnum.SOL) || 0;

    const amountUsd = currentAssetPrice
      ? new BigNumber(amountFormatted.amount).multipliedBy(currentAssetPrice).toNumber()
      : 0;

    if (type === TypeReturnEnum.SIMPLE) {
      return {
        ...transaction,
        amount,
        amountFormatted: {
          ...amountFormatted,
          amountInSol: isFiatToken
            ? new BigNumber(amountFormatted.amount).dividedBy(currentSOLPrice).toNumber()
            : amountFormatted.amount,
          usd: isFiatToken ? amountFormatted?.format : amountUsd
        }
      } as TransactionFacadeType;
    }

    return {
      amount,
      amountFormatted: {
        ...amountFormatted,
        amountInSol: isFiatToken
          ? new BigNumber(amountFormatted.amount).dividedBy(currentSOLPrice).toNumber()
          : amountFormatted.amount,
        usd: isFiatToken ? Number(amountFormatted?.format || 0) : amountUsd
      },
      id: transaction.id,
      description: transaction?.description,
      tag: transaction?.tag,
      symbol: transaction?.symbol,
      tokenIcon: transaction?.tokenIcon,
      decimals: transaction?.decimals,
      walletAddressTrackId: account?.id,
      tokenName: transaction.tokenName,
      toUserAccount: transaction?.toUserAccount,
      fromUserAccount: transaction?.fromUserAccount || account.address,
      date: transaction?.date,
      signature: transaction?.signature,
      idSolscan: transaction?.idSolscan,
      direction: transaction?.direction,
      walletAddressTrack: transaction?.walletAddressTrack || null
    };
  });
}

export const formatStringToBoolean = (value: string) => {
  return value === 'true';
};

export const getGuildInfoForTreasury = (guilds: DiscordGuildPartialInfo[], treasuries: any) => {
  return guilds.filter((guild) => treasuries.some((treasury) => treasury?.discordID === guild.id));
};

export const sanitizeProject = (project: TreasuryDBType) => {
  return {
    id: project?.id,
    name: project?.name,
    description: project?.description,
    status: project?.status,
    tags: project?.tags
  };
};

export const sanitizeProjectsForOutputs = (projects: TreasuryDBType[]) => {
  return projects.map(sanitizeProject);
};
