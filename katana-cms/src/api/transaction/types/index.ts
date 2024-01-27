import { CurrencyEnum, TokenNameEnum } from '../../../../@types/currencyEnums';

export enum TIME_FILTER_TRANSACTION {
  ONE_DAY = 'day',
  ONE_WEEK = 'week',
  ONE_MONTH = 'month',
  ONE_YEAR = 'year',
  MAX = 'max'
}

export type TransactionDBType = {
  id: number;
  toUserAccount: string;
  symbol: CurrencyType;
  tokenIcon: string;
  tokenName: TokenNameEnum;
  decimals: number;
  fromUserAccount: string;
  date: string;
  description?: string;
  amount: number;
  tag?: {
    id: number;
    color: string;
    name: string;
  };
  treasury?: Record<string, any>;
  walletAddressTrack?: { id: number; address: string; color: string; label: string };
  signature: string;
  idSolscan: string;
  direction: 'IN' | 'OUT';
};

export type TransactionSolscanType = {
  blockTime: number;
  decimals: number;
  dst: string;
  fee: number;
  isInner: boolean;
  lamport: number;
  slot: number;
  src: string;
  status: string;
  txHash: string;
  txNumberSolTransfer: number;
  _id: string;
};

export type TransactionSolscanSPLType = {
  _id: string;
  address: string;
  signature: string[];
  changeType: 'inc' | 'dec';
  changeAmount: number;
  decimals: number;
  postBalance: string;
  preBalance: string;
  tokenAddress: string;
  owner: string;
  symbol?: CurrencyEnum;
  blockTime: number;
  slot: number;
  fee: number;
};

export type TransactionFacadeType = {
  id?: number;
  description?: string;
  tag?: {
    id: number;
    color: string;
    name: string;
  };
  decimals: number;
  symbol: CurrencyType;
  tokenIcon: CurrencyType;
  tokenName: TokenNameEnum;
  amount: number;
  amountFormatted: {
    original: number;
    symbol: CurrencyType;
    amount: number;
    amountInSol: number;
    format: string;
    usd: number;
  };
  walletAddressTrackId?: number;
  toUserAccount: string;
  fromUserAccount: string;
  date: string;
  signature: string;
  idSolscan: string;
  direction: 'IN' | 'OUT';
  walletAddressTrack: {
    address: string;
    color: string;
    label: string;
  } | null;
};
