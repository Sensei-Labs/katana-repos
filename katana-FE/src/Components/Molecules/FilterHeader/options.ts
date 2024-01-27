import {
  AmountTransactionEnum,
  PeriodTransactionEnum
} from '@/Contexts/Transactions/types';
import { TRANSACTION_DIRECTION } from '@/fetches/statistic';

export const mapOptionsDirection = [
  {
    label: 'IN',
    value: TRANSACTION_DIRECTION.IN.toUpperCase()
  },
  {
    label: 'OUT',
    value: TRANSACTION_DIRECTION.OUT.toUpperCase()
  }
];

export const mapOptionsAssets = [
  {
    label: 'SOL',
    value: 'SOL'
  },
  {
    label: 'USDC',
    value: 'USDC'
  }
];

export const mapOptionsPeriod = [
  {
    label: 'Today',
    value: PeriodTransactionEnum.TODAY
  },
  {
    label: '1 week',
    value: PeriodTransactionEnum.LAST_WEEK
  },
  {
    label: '1 month',
    value: PeriodTransactionEnum.LAST_MONTH
  },
  {
    label: '3 months',
    value: PeriodTransactionEnum.LAST_THREE_MONTH
  },
  {
    label: '1 year',
    value: PeriodTransactionEnum.LAST_YEAR
  }
];

export const mapOptionsAmount = [
  {
    label: '0-10 SOL',
    value: AmountTransactionEnum['0_10_SOL']
  },
  {
    label: '10-50 SOL',
    value: AmountTransactionEnum['10_50_SOL']
  },
  {
    label: '50-100 SOL',
    value: AmountTransactionEnum['50_100_SOL']
  },
  {
    label: 'Above 100 SOL',
    value: AmountTransactionEnum.ABOVE_100_SOL
  }
];
