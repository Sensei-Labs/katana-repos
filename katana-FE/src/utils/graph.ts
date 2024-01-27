import dayjs from 'dayjs';

const twelveArray = Array.from(new Array(12).keys());

const FORMAT_DATE = 'MMM, YYYY';

export function getDateForYearList(date: string | Date) {
  return dayjs(date).format(FORMAT_DATE);
}

export function getLastYearInMonth() {
  const date = dayjs().startOf('month');

  return twelveArray
    .map((index) => {
      if (!index) return date.format(FORMAT_DATE);
      return date.subtract(index, 'month').format(FORMAT_DATE);
    })
    .reverse();
}

export function getMergeDatesWithData(
  _values: { name: string; color: string; value: number }[]
) {
  const output: any = {};
  const colors: string[] = [];
  const labels: string[] = [];

  _values.forEach(({ name, color }) => {
    if (!output[name]) {
      colors.push(color);
      labels.push(name);
      output[name] = {
        values: twelveArray.map(() => 0) as number[],
        name: name
      };
    }
  });

  return {
    colors,
    labels,
    allInitialDataInObject: output
  };
}

export function getMergeData(
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
