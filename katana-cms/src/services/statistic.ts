import { TIME_FILTER_TRANSACTION, TransactionFacadeType } from '../api/transaction/types';
import {
  getProjectWorker,
  PayloadPieCategory,
  updateCategoriesGraphProject,
  updateAmountGraphProject,
  PayloadLineAmount,
  TRANSACTIONS_TYPE
} from './project';
import Statistic from '../api/transaction/Statistic/Transactions';
import { resolveDirectionTransaction } from '../api/transaction/Statistic/Transactions/actions';
import Utils from '../utils';

const resolveKeyForPie = {
  [TIME_FILTER_TRANSACTION.ONE_DAY]: 'StatisticPieDaily',
  [TIME_FILTER_TRANSACTION.ONE_WEEK]: 'StatisticPieWeekly',
  [TIME_FILTER_TRANSACTION.ONE_MONTH]: 'StatisticPieMonthly',
  [TIME_FILTER_TRANSACTION.ONE_YEAR]: 'StatisticPieYearly',
  [TIME_FILTER_TRANSACTION.MAX]: 'StatisticPieAll'
};

export const resolveKeyForLine = {
  [TIME_FILTER_TRANSACTION.ONE_DAY]: 'StatisticLineDaily',
  [TIME_FILTER_TRANSACTION.ONE_WEEK]: 'StatisticLineWeekly',
  [TIME_FILTER_TRANSACTION.ONE_MONTH]: 'StatisticLineMonthly',
  [TIME_FILTER_TRANSACTION.ONE_YEAR]: 'StatisticLineYearly'
};

export const resolveKeyForPayload = {
  [TIME_FILTER_TRANSACTION.ONE_DAY]: 'statisticDataDaily',
  [TIME_FILTER_TRANSACTION.ONE_WEEK]: 'statisticDataWeekly',
  [TIME_FILTER_TRANSACTION.ONE_MONTH]: 'statisticDataMonthly',
  [TIME_FILTER_TRANSACTION.ONE_YEAR]: 'statisticDataYearly',
  [TIME_FILTER_TRANSACTION.MAX]: 'statisticDataAll'
};

export async function getStatisticForProject({
  projectId,
  type,
  time,
  showRoyalties,
  transactionType
}: {
  projectId: number;
  type: 'pie' | 'line';
  time: TIME_FILTER_TRANSACTION;
  transactionType: TRANSACTIONS_TYPE;
  showRoyalties: boolean;
}) {
  const { data } = await getProjectWorker(projectId);
  if (showRoyalties) {
    const outputPie = {
      colors: [],
      labels: [],
      values: []
    };

    const outputLine = {
      colors: [],
      labels: [],
      tags: [],
      data: []
    };

    Object.values(TRANSACTIONS_TYPE).forEach((_transactionType) => {
      if (type === 'pie') {
        const key = `${_transactionType}${resolveKeyForPie[time]}`;
        if (_transactionType === TRANSACTIONS_TYPE.IN) {
          outputPie.labels.push(data[key]?.labels?.[0] ?? 'Royalties');
          outputPie.colors.push(data[key]?.colors?.[0] ?? '#00C853');
          return outputPie.values.push(data[key]?.values?.[0] ?? 0);
        }
        outputPie.colors = data[key]?.colors ?? [];
        outputPie.labels = data[key]?.labels ?? [];
        outputPie.values = data[key]?.values ?? [];
      }

      // Line
      const key = `${_transactionType}${resolveKeyForLine[time]}`;
      if (_transactionType === TRANSACTIONS_TYPE.IN) {
        outputLine.colors.push(data[key]?.colors?.[0] ?? '#00C853');
        outputLine.tags.push(data[key]?.tags?.[0] ?? 'Royalties');
        return outputLine.data.push(...data[key]?.data);
      }
      outputLine.colors = data[key]?.colors ?? [];
      outputLine.labels = data[key]?.labels ?? [];
      outputLine.tags = data[key]?.tags ?? [];
      outputLine.data = data[key]?.data ?? [];
    });

    return type === 'pie' ? outputPie : outputLine;
  }
  // only out
  if (type === 'pie') {
    const key = `${transactionType}${resolveKeyForPie[time]}`;
    return data[key];
  }
  const key = `${transactionType}${resolveKeyForLine[time]}`;
  return data[key];
}

export async function setNewBalance(projectId: number, allTransactionsFormat: TransactionFacadeType[]) {
  const statisticService = new Statistic(allTransactionsFormat);

  // set new balances for project
  console.log(`--- Creating new balances ---`);
  await statisticService.setBalances(projectId);
}

export async function setStatisticAmountForProject(projectId: number, allTransactionsFormat: TransactionFacadeType[]) {
  const statisticService = new Statistic(allTransactionsFormat);

  return await Utils.asyncMap(Object.values(TRANSACTIONS_TYPE), async (type) => {
    const resolveFilter = resolveDirectionTransaction(type);
    statisticService.setFilterData(resolveFilter);

    const payload: PayloadLineAmount = {
      statisticDataDaily: {
        tags: [],
        colors: [],
        labels: [],
        data: []
      },
      statisticDataWeekly: {
        tags: [],
        colors: [],
        labels: [],
        data: []
      },
      statisticDataMonthly: {
        tags: [],
        colors: [],
        labels: [],
        data: []
      },
      statisticDataYearly: {
        tags: [],
        colors: [],
        labels: [],
        data: []
      }
    };

    Utils.map(Object.values(TIME_FILTER_TRANSACTION), (time) => {
      if (time === TIME_FILTER_TRANSACTION.MAX) return;
      const key = resolveKeyForPayload[time];
      const { data, labels, tags, colors } = statisticService.getTransactionsForTime(time);

      payload[key].labels = labels;
      payload[key].colors = colors;
      payload[key].tags = tags;
      payload[key].data = data;
    });

    try {
      const { data } = await updateAmountGraphProject(projectId, payload, type);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      statisticService.reset();
    }
  });
}

export async function setStatisticCategoryForProject(projectId: number, allTransactionsFormat: TransactionFacadeType[]) {
  const statisticService = new Statistic(allTransactionsFormat);

  return await Utils.asyncMap(Object.values(TRANSACTIONS_TYPE), async (type) => {
    const resolveFilter = resolveDirectionTransaction(type);
    statisticService.setFilterData(resolveFilter);

    const payload: PayloadPieCategory = {
      statisticDataDaily: {
        colors: [],
        labels: [],
        values: []
      },
      statisticDataWeekly: {
        colors: [],
        labels: [],
        values: []
      },
      statisticDataMonthly: {
        colors: [],
        labels: [],
        values: []
      },
      statisticDataYearly: {
        colors: [],
        labels: [],
        values: []
      },
      statisticDataAll: {
        colors: [],
        labels: [],
        values: []
      }
    };

    Object.values(TIME_FILTER_TRANSACTION).forEach((time) => {
      const { values, labels, colors } = statisticService.getTransactionsForCategory(time);
      payload[resolveKeyForPayload[time]].labels = labels;
      payload[resolveKeyForPayload[time]].colors = colors;
      payload[resolveKeyForPayload[time]].values = values;
    });

    try {
      const { data } = await updateCategoriesGraphProject(projectId, payload, type);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      statisticService.reset();
    }
  });
}
