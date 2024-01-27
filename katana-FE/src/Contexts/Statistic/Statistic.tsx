import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import {
  getStatisticLineForProject,
  getStatisticPieForProject,
  setStatisticLineForProject,
  setStatisticPieForProject,
  TRANSACTION_DIRECTION
} from '@/fetches/statistic';
import { useProjectOne } from '@/Contexts/ProjectOne';
import useSWR from 'swr';
import { fetcher } from '@/services/api';
import useTraceSync from '@/hooks/useTraceSync';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';

export enum TIME_FILTER_STATISTIC {
  ONE_DAY = 'day',
  ONE_WEEK = 'week',
  ONE_MONTH = 'month',
  ONE_YEAR = 'year',
  MAX = 'max'
}

type TransactionsContextType = {
  isLoading: boolean;
  showPieRoyalties: boolean;
  showLineRoyalties: boolean;
  lineTimeFilter: TIME_FILTER_STATISTIC;
  pieTimeFilter: TIME_FILTER_STATISTIC;
  onChangeTimeFilter(time: TIME_FILTER_STATISTIC, type: 'pie' | 'line'): void;
  onShowRoyalties(type: 'pie' | 'line'): void;
  onChangeDirection(type: 'pie' | 'line'): void;
  onRefresh(type: 'pie' | 'line'): void;
  line: {
    data: any[];
    labels: string[];
    tags: string[];
    colors: string[];
    loading: boolean;
    loadingRefresh: boolean;
  };
  pie: {
    values: number[];
    labels: string[];
    colors: string[];
    loading: boolean;
    loadingRefresh: boolean;
  };
};

const defaultValues: TransactionsContextType = {
  isLoading: true,
  lineTimeFilter: TIME_FILTER_STATISTIC.ONE_YEAR,
  pieTimeFilter: TIME_FILTER_STATISTIC.MAX,
  showLineRoyalties: true,
  showPieRoyalties: true,
  onShowRoyalties() {},
  onRefresh() {},
  onChangeDirection() {},
  onChangeTimeFilter() {},
  line: {
    labels: [],
    colors: [],
    tags: [],
    data: [],
    loading: true,
    loadingRefresh: false
  },
  pie: {
    values: [],
    colors: [],
    labels: [],
    loading: true,
    loadingRefresh: false
  }
};

const StatisticContext = createContext<TransactionsContextType>(defaultValues);

export const StatisticProvider = ({ children }: PropsWithChildren) => {
  const { treasury } = useProjectOne();
  const { getAmountInUsd } = useAssetPrice();
  const [loadingPieRefresh, togglePieRefresh] = useTraceSync();
  const [loadingLineRefresh, toggleLineRefresh] = useTraceSync();

  const [pieDirection, setPieDirection] = useState<TRANSACTION_DIRECTION>(
    TRANSACTION_DIRECTION.OUT
  );
  const [showPieRoyalties, setPieRoyalties] = useState<boolean>(false);
  const [showLineRoyalties, setLineRoyalties] = useState<boolean>(false);
  const [lineDirection, setLineDirection] = useState<TRANSACTION_DIRECTION>(
    TRANSACTION_DIRECTION.OUT
  );
  const [lineTimeFilter, setLineTimeFilter] = useState<TIME_FILTER_STATISTIC>(
    TIME_FILTER_STATISTIC.ONE_YEAR
  );
  const [pieTimeFilter, setPieTimeFilter] = useState<TIME_FILTER_STATISTIC>(
    TIME_FILTER_STATISTIC.MAX
  );

  const { isLoading: isPieLoading, data: dataPie } = useSWR<
    TransactionsContextType['pie']
  >(
    getStatisticPieForProject({
      treasuryId: treasury?.id,
      time: pieTimeFilter,
      transactionType: pieDirection,
      showRoyalties: showPieRoyalties
    }),
    fetcher,
    {
      refreshInterval: 1000 * 60 * 5
    }
  );

  const { isLoading: isLineLoading, data: dataLine } = useSWR<
    TransactionsContextType['line']
  >(
    getStatisticLineForProject({
      treasuryId: treasury?.id,
      time: lineTimeFilter,
      showRoyalties: showLineRoyalties,
      transactionType: lineDirection
    }),
    fetcher,
    {
      refreshInterval: 1000 * 60 * 5
    }
  );

  const onChangeTimeFilter = useCallback(
    (time: TIME_FILTER_STATISTIC, type: 'pie' | 'line') => {
      if (type === 'line') {
        setLineTimeFilter(time);
      } else {
        setPieTimeFilter(time);
      }
    },
    []
  );

  const onRefresh = useCallback(
    (type: 'pie' | 'line') => {
      if (type === 'line') {
        return toggleLineRefresh(() =>
          setStatisticLineForProject(treasury?.id)
        );
      } else {
        return togglePieRefresh(() => setStatisticPieForProject(treasury?.id));
      }
    },
    [toggleLineRefresh, togglePieRefresh, treasury?.id]
  );

  const onChangeDirection = useCallback((type: 'pie' | 'line') => {
    if (type === 'line') {
      return setLineDirection((prev) => {
        return prev === TRANSACTION_DIRECTION.IN
          ? TRANSACTION_DIRECTION.OUT
          : TRANSACTION_DIRECTION.IN;
      });
    } else {
      return setPieDirection((prev) => {
        return prev === TRANSACTION_DIRECTION.IN
          ? TRANSACTION_DIRECTION.OUT
          : TRANSACTION_DIRECTION.IN;
      });
    }
  }, []);

  const onShowRoyalties = useCallback((type: 'pie' | 'line') => {
    if (type === 'line') {
      return setLineRoyalties((prev) => !prev);
    } else {
      return setPieRoyalties((prev) => !prev);
    }
  }, []);

  return (
    <StatisticContext.Provider
      value={{
        onChangeTimeFilter,
        onRefresh,
        pieTimeFilter,
        lineTimeFilter,
        showPieRoyalties,
        onShowRoyalties,
        showLineRoyalties,
        onChangeDirection,
        isLoading: isPieLoading || isLineLoading,
        line: useMemo(() => {
          const dataFormat = (dataLine?.data || []).map((input) => ({
            ...input,
            values: input.values.map((val: number) =>
              getAmountInUsd(AssetAcceptedEnum.SOL, val)
            )
          }));
          return {
            ...(dataLine || defaultValues.line),
            data: dataFormat,
            loading: isLineLoading,
            loadingRefresh: loadingLineRefresh
          };
        }, [dataLine, getAmountInUsd, isLineLoading, loadingLineRefresh]),
        pie: useMemo(() => {
          const values = (dataPie?.values || []).map((input) =>
            getAmountInUsd(AssetAcceptedEnum.SOL, input)
          );
          return {
            ...(dataPie || defaultValues.pie),
            values,
            loading: isPieLoading,
            loadingRefresh: loadingPieRefresh
          };
        }, [dataPie, isPieLoading, loadingPieRefresh, getAmountInUsd])
      }}
    >
      {children}
    </StatisticContext.Provider>
  );
};

export const useStatistic = () => useContext(StatisticContext);
