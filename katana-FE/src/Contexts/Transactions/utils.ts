import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { AmountTransactionEnum, FilterKeyEnum, FilterType } from './types';

const getAmountInSol = (amount: number) => {
  return new BigNumber(amount).multipliedBy(1000000000).toNumber();
};

const mapAmountToFilter = {
  [AmountTransactionEnum['0_10_SOL']]: {
    $lte: getAmountInSol(10)
  },
  [AmountTransactionEnum['10_50_SOL']]: {
    $gt: getAmountInSol(10),
    $lte: getAmountInSol(50)
  },
  [AmountTransactionEnum['50_100_SOL']]: {
    $gt: getAmountInSol(50),
    $lte: getAmountInSol(100)
  },
  [AmountTransactionEnum['ABOVE_100_SOL']]: {
    $gt: getAmountInSol(100)
  }
};

const resolveDate = (date: string, filter: FilterKeyEnum, acc: any) => {
  if (!!acc?.$and?.length) {
    return {
      ...acc,
      $and: [
        ...acc.$and,
        {
          date: {
            [filter === FilterKeyEnum.DATE_FROM ? '$gte' : '$lte']: date
          }
        }
      ]
    };
  }
  return {
    ...acc,
    $and: [
      {
        date: {
          [filter === FilterKeyEnum.DATE_FROM ? '$gte' : '$lte']: date
        }
      }
    ]
  };
};
const resolveSearch = (search: string) => {
  return {
    $or: [
      {
        id: {
          $containsi: search
        }
      },
      {
        signature: {
          $containsi: search
        }
      },
      {
        toUserAccount: {
          $containsi: search
        }
      },
      {
        fromUserAccount: {
          $containsi: search
        }
      },
      {
        description: {
          $containsi: search
        }
      }
    ]
  };
};

export function resolveParams(params: FilterType) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      if (key === FilterKeyEnum.DATE_FROM) {
        (acc as any) = resolveDate(
          dayjs(value as string)
            .startOf('day')
            .toISOString(),
          FilterKeyEnum.DATE_FROM,
          acc
        );
      } else if (key === FilterKeyEnum.DATE_TO) {
        (acc as any) = resolveDate(
          dayjs(value as string)
            .endOf('day')
            .toISOString(),
          FilterKeyEnum.DATE_TO,
          acc
        );
      } else if (key === FilterKeyEnum.AMOUNT) {
        (acc as any)[key] = mapAmountToFilter[value as AmountTransactionEnum];
      } else if (key === FilterKeyEnum.SEARCH) {
        (acc as any) = {
          ...acc,
          ...resolveSearch(value as string)
        };
      } else {
        (acc as any)[key] = value;
      }
    }
    return acc;
  }, {});
}
