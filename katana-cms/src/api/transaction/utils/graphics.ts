import dayjs from 'dayjs';
import { TIME_FILTER_TRANSACTION } from '../types';

const twelveArray = Array.from(new Array(12).keys());
const sevenArray = Array.from(new Array(7).keys());
const twentyFourArray = Array.from(new Array(24).keys());

export const COMPLEMENTED_DATE_ONE_FORMAT = ' DD/MM/YYYY'

export const FORMAT_TIMELINE = {
  [TIME_FILTER_TRANSACTION.ONE_DAY]: 'hh A' + COMPLEMENTED_DATE_ONE_FORMAT,
  [TIME_FILTER_TRANSACTION.ONE_WEEK]: 'DD, ddd',
  [TIME_FILTER_TRANSACTION.ONE_MONTH]: 'DD, MMM',
  [TIME_FILTER_TRANSACTION.ONE_YEAR]: 'MMM, YYYY',
  [TIME_FILTER_TRANSACTION.MAX]: 'MMM, YYYY',
};

export function isValidTimeFilter(time: string) {
  return Object.values(TIME_FILTER_TRANSACTION).includes(time as TIME_FILTER_TRANSACTION);
}

export function getDateForYearList(date: string | Date, type: TIME_FILTER_TRANSACTION) {
  const format = FORMAT_TIMELINE[type];
  return dayjs(date).format(format);
}

export function getLastDayInHours() {
  const CUSTOM_FORMAT_DATE = FORMAT_TIMELINE[TIME_FILTER_TRANSACTION.ONE_DAY];
  const date = dayjs().endOf('day').startOf('hour');

  return twentyFourArray
    .map((index) => {
      if (!index) return date.format(CUSTOM_FORMAT_DATE);
      return date.subtract(index, 'hour').format(CUSTOM_FORMAT_DATE);
    })
    .reverse();
}

export function getLastWeekInDays() {
  const CUSTOM_FORMAT_DATE = FORMAT_TIMELINE[TIME_FILTER_TRANSACTION.ONE_WEEK];
  const date = dayjs();

  return sevenArray
    .map((index) => {
      if (!index) return date.format(CUSTOM_FORMAT_DATE);
      return date.subtract(index, 'day').format(CUSTOM_FORMAT_DATE);
    })
    .reverse();
}

export function getLastMonthInDays() {
  const CUSTOM_FORMAT_DATE = FORMAT_TIMELINE[TIME_FILTER_TRANSACTION.ONE_MONTH];
  const dateInFinishMonth = dayjs().endOf('month');
  const daysInMonth = dayjs().daysInMonth();
  const daysArray = Array.from(new Array(daysInMonth).keys());

  return daysArray
    .map((index) => {
      if (!index) return dateInFinishMonth.format(CUSTOM_FORMAT_DATE);
      return dateInFinishMonth.subtract(index, 'day').format(CUSTOM_FORMAT_DATE);
    })
    .reverse();
}

export function getLastYearInMonth() {
  const CUSTOM_FORMAT_DATE = FORMAT_TIMELINE[TIME_FILTER_TRANSACTION.ONE_YEAR];
  const date = dayjs().startOf('month');

  return twelveArray
    .map((index) => {
      if (!index) return date.format(CUSTOM_FORMAT_DATE);
      return date.subtract(index, 'month').format(CUSTOM_FORMAT_DATE);
    })
    .reverse();
}

export function getMergeDatesWithData(_values: { name: string; color: string; value: number }[], timeline: string[]) {
  const output: { [key: string]: { values: number[]; name: string } } = {};
  const colors: string[] = [];
  const tags: string[] = [];

  _values.forEach(({ name, color }) => {
    if (!output[name]) {
      colors.push(color);
      tags.push(name);
      output[name] = {
        values: timeline.map(() => 0) as number[],
        name: name
      };
    }
  });

  return {
    colors,
    tags,
    allInitialDataInObject: output
  };
}


export function getMergePieData(
  _values: { name: string; color: string; value: number }[]
) {
  const output: any = {};
  const colors: string[] = [];
  const labels: string[] = [];
  const values: number[] = [];

  _values.forEach(({ name, color }) => {
    if (!output[name]) {
      colors.push(color);
      labels.push(name);
      output[name] = true;
    }
  });

  return {
    colors,
    labels,
    values
  };
}
