export type TransactionType = 'in' | 'out';

type BodyPieData = {
  colors: string[];
  labels: string[];
  values: number[];
};

export type BodyPie = {
  statisticDataDaily: BodyPieData;
  statisticDataWeekly: BodyPieData;
  statisticDataMonthly: BodyPieData;
  statisticDataYearly: BodyPieData;
  statisticDataAll: BodyPieData;
};

export function resolvePayloadForPieGraphics(body: BodyPie, type: TransactionType) {
  if (type === 'in') {
    return {
      inStatisticPieDaily: {
        colors: body.statisticDataDaily.colors,
        labels: body.statisticDataDaily.labels,
        values: body.statisticDataDaily.values,
      },
      inStatisticPieWeekly: {
        colors: body.statisticDataWeekly.colors,
        labels: body.statisticDataWeekly.labels,
        values: body.statisticDataWeekly.values,
      },
      inStatisticPieMonthly: {
        colors: body.statisticDataMonthly.colors,
        labels: body.statisticDataMonthly.labels,
        values: body.statisticDataMonthly.values,
      },
      inStatisticPieYearly: {
        colors: body.statisticDataYearly.colors,
        labels: body.statisticDataYearly.labels,
        values: body.statisticDataYearly.values,
      },
      inStatisticPieAll: {
        colors: body.statisticDataAll.colors,
        labels: body.statisticDataAll.labels,
        values: body.statisticDataAll.values,
      },
    };
  }

  return {
    outStatisticPieDaily: {
      colors: body.statisticDataDaily.colors,
      labels: body.statisticDataDaily.labels,
      values: body.statisticDataDaily.values,
    },
    outStatisticPieWeekly: {
      colors: body.statisticDataWeekly.colors,
      labels: body.statisticDataWeekly.labels,
      values: body.statisticDataWeekly.values,
    },
    outStatisticPieMonthly: {
      colors: body.statisticDataMonthly.colors,
      labels: body.statisticDataMonthly.labels,
      values: body.statisticDataMonthly.values,
    },
    outStatisticPieYearly: {
      colors: body.statisticDataYearly.colors,
      labels: body.statisticDataYearly.labels,
      values: body.statisticDataYearly.values,
    },
    outStatisticPieAll: {
      colors: body.statisticDataAll.colors,
      labels: body.statisticDataAll.labels,
      values: body.statisticDataAll.values,
    },
  };
}

type LineData = {
  name: string;
  values: number[];
};

type LineBase = {
  colors: string[];
  labels: string[];
  tags: string[];
  data: LineData[];
};

export type BodyLine = {
  statisticDataDaily: LineBase;
  statisticDataWeekly: LineBase;
  statisticDataMonthly: LineBase;
  statisticDataYearly: LineBase;
};

export function resolvePayloadForLineGraphics(body: BodyLine, type: TransactionType) {
  if (type === 'in') {
    return {
      inStatisticLineDaily: {
        ...body.statisticDataDaily,
      },
      inStatisticLineWeekly: {
        ...body.statisticDataWeekly,
      },
      inStatisticLineMonthly: {
        ...body.statisticDataMonthly,
      },
      inStatisticLineYearly: {
        ...body.statisticDataYearly,
      },
    };
  }

  return {
    outStatisticLineDaily: {
      ...body.statisticDataDaily,
    },
    outStatisticLineWeekly: {
      ...body.statisticDataWeekly,
    },
    outStatisticLineMonthly: {
      ...body.statisticDataMonthly,
    },
    outStatisticLineYearly: {
      ...body.statisticDataYearly,
    },
  };
}
