import { TIME_FILTER_TRANSACTION, TransactionFacadeType } from '../../types';
import {
  COMPLEMENTED_DATE_ONE_FORMAT,
  getDateForYearList,
  getLastDayInHours,
  getLastMonthInDays,
  getLastWeekInDays,
  getLastYearInMonth,
  getMergeDatesWithData,
  getMergePieData
} from '../../utils/graphics';
import Utils, { ROYALTY_COLOR } from '../../../../utils';
import dayjs from 'dayjs';
import { TRANSACTION_DIRECTION } from '../../../treasury/utils';
import { updateBalancesInProject } from '../../../../services/project';
import BigNumber from "bignumber.js";

type TransactionsForTime = {
  colors: string[];
  tags: string[];
  labels: string[];
  data: {
    name: string;
    values: number[];
  }[];
};

const DEFAULT_ANY_NAME = 'Any';
const ROYALTIES_LABEL = 'Royalties';

export default class Statistic {
  private rawTransactions: TransactionFacadeType[];
  private transactions: TransactionFacadeType[];
  private readonly lastDayInHours: string[] = [];
  private readonly lastWeekInDays: string[] = [];
  private readonly lastMonthInDays: string[] = [];
  private readonly lastYearInMonths: string[] = [];

  constructor(transactions: TransactionFacadeType[]) {
    this.rawTransactions = transactions;
    this.transactions = transactions;
    this.lastDayInHours = getLastDayInHours();
    this.lastWeekInDays = getLastWeekInDays();
    this.lastMonthInDays = getLastMonthInDays();
    this.lastYearInMonths = getLastYearInMonth();
  }

  getTimeForFilter(time: TIME_FILTER_TRANSACTION): string[] {
    const mapTimer = {
      [TIME_FILTER_TRANSACTION.ONE_DAY]: this.lastDayInHours,
      [TIME_FILTER_TRANSACTION.ONE_WEEK]: this.lastWeekInDays,
      [TIME_FILTER_TRANSACTION.ONE_MONTH]: this.lastMonthInDays,
      [TIME_FILTER_TRANSACTION.ONE_YEAR]: this.lastYearInMonths,
      [TIME_FILTER_TRANSACTION.MAX]: this.lastYearInMonths
    };

    return mapTimer[time];
  }

  // GETTERS
  getTransactionsForTime(time: TIME_FILTER_TRANSACTION): TransactionsForTime {
    const timeline = this.getTimeForFilter(time);
    const yearMonthNowText = dayjs().format(COMPLEMENTED_DATE_ONE_FORMAT);
    const valuesTransactions = this.transactions.map((transaction) => {
      return {
        name:
          transaction?.tag?.name ||
          (transaction.direction === TRANSACTION_DIRECTION.IN.toUpperCase() ? ROYALTIES_LABEL : DEFAULT_ANY_NAME),
        value: BigNumber(transaction?.amountFormatted?.amountInSol).abs().toNumber() || 0,
        color: transaction?.tag?.color || ROYALTY_COLOR,
        date: transaction?.date
      };
    });

    const { allInitialDataInObject, colors, tags } = getMergeDatesWithData(valuesTransactions, timeline);

    Utils.map(valuesTransactions, (current) => {
      const findIndexRecord = timeline.findIndex((d) => {
        return d === getDateForYearList(current.date, time);
      });

      if (findIndexRecord !== -1) {
        allInitialDataInObject[current?.name].values[findIndexRecord] += current.value;
      }
    });

    const formatDataForOutput = Object.values(allInitialDataInObject);
    const formatTimeLine =
      time === TIME_FILTER_TRANSACTION.ONE_DAY ? timeline.map((_time) => _time.replace(yearMonthNowText, '')) : timeline;

    return {
      colors,
      tags: tags,
      labels: formatTimeLine,
      data: formatDataForOutput
    };
  }

  getInitialDateForTime(time: TIME_FILTER_TRANSACTION) {
    const mapper = {
      [TIME_FILTER_TRANSACTION.ONE_DAY]: dayjs(),
      [TIME_FILTER_TRANSACTION.ONE_WEEK]: dayjs().subtract(1, 'week'),
      [TIME_FILTER_TRANSACTION.ONE_MONTH]: dayjs().subtract(1, 'month'),
      [TIME_FILTER_TRANSACTION.ONE_YEAR]: dayjs().subtract(1, 'year')
    };

    return mapper[time] ? mapper[time].startOf('day') : undefined;
  }

  getTransactionsForCategory(time: TIME_FILTER_TRANSACTION) {
    const now = dayjs().endOf('day');
    const startDate = this.getInitialDateForTime(time);
    const valuesTransactions = [];

    Utils.map(this.transactions, (transaction) => {
      const dateTransaction = dayjs(transaction.date);
      if (time === TIME_FILTER_TRANSACTION.MAX) {
        valuesTransactions.push({
          name:
            transaction?.tag?.name ||
            (transaction.direction === TRANSACTION_DIRECTION.IN.toUpperCase() ? ROYALTIES_LABEL : DEFAULT_ANY_NAME),
          value: BigNumber(transaction?.amountFormatted?.amountInSol || 0).abs().toNumber(),
          color: transaction?.tag?.color || ROYALTY_COLOR
        });
      } else if (startDate.isBefore(dateTransaction) && now.isAfter(dateTransaction)) {
        valuesTransactions.push({
          name:
            transaction?.tag?.name ||
            (transaction.direction === TRANSACTION_DIRECTION.IN.toUpperCase() ? ROYALTIES_LABEL : DEFAULT_ANY_NAME),
          value: BigNumber(transaction?.amountFormatted?.amountInSol || 0).abs().toNumber(),
          color: transaction?.tag?.color || ROYALTY_COLOR
        });
      }
    });

    const { colors, labels, values } = getMergePieData(valuesTransactions);

    Utils.map(valuesTransactions, (current) => {
      const findIndexRecord = labels.findIndex((item) => item === current.name);

      if (findIndexRecord !== -1) {
        values[findIndexRecord] = (values[findIndexRecord] || 0) + current.value;
      }
    });

    return {
      colors,
      labels,
      values
    };
  }

  // SETTERS
  setFilterData(cb: (transaction: TransactionFacadeType, index?: number) => boolean) {
    this.transactions = this.transactions.filter(cb);
  }

  async setBalances(projectId: number) {
    const payload = {
      totalInputUsd: 0,
      totalOutputUsd: 0,
      totalInputSol: 0,
      totalOutputSol: 0
    };

    Utils.map(this.rawTransactions, (transaction) => {
      if (!!transaction?.tag) {
        if (transaction.direction === TRANSACTION_DIRECTION.IN.toUpperCase()) {
          payload.totalInputUsd += BigNumber(transaction?.amountFormatted?.usd || 0).abs().toNumber();
          payload.totalInputSol += BigNumber(transaction?.amountFormatted?.amountInSol || 0).abs().toNumber();
        } else {
          payload.totalOutputUsd += BigNumber(transaction?.amountFormatted?.usd || 0).abs().toNumber();
          payload.totalOutputSol += BigNumber(transaction?.amountFormatted?.amountInSol || 0).abs().toNumber();
        }
      }
    });

    try {
      const { data } = await updateBalancesInProject(projectId, payload);
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  reset() {
    this.transactions = this.rawTransactions;
  }
}
