import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { api, fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import useToggle from '@/hooks/useToggle';
import { GET_SEPARATOR_FILE } from '@/config';
import useTraceSync from '@/hooks/useTraceSync';
import { useProjectOne } from '@/Contexts/ProjectOne';
import ModalEditTransaction from '@/Components/Molecules/ModalEditTransaction';

import {
  DirectionSort,
  FilterType,
  FilterTypeValue,
  SorterType,
  TransactionsContextType
} from './types';
import { resolveParams } from '@/Contexts/Transactions/utils';
import { message } from 'antd';
import { formatErrorMessage } from '@/utils/formatError';
import { formatDateTime } from '@/utils/formatDateTime';

const defaultValues: TransactionsContextType = {
  transactions: [],
  latestTransactions: [],
  pagination: null,
  selectedRows: null,
  onChangePage() {},
  setLimit() {},
  updateItemInCache() {},
  onEditRows() {},
  loading: true,
  isLoadingDownload: false,
  isLoadingLatest: true,
  internalPath: '',
  balance: 0,
  transactionsCount: 0,
  transactionLoading: true,
  toggleModalTransaction() {},
  onSetFilter() {},
  downloadFile() {},
  onChangeSorter() {},
  getWalletFrom: () => undefined
};

const TransactionsContext =
  createContext<TransactionsContextType>(defaultValues);

const path = `${API_ROUTES.GET_ALL_TRANSACTIONS.path}`;

export const TransactionsProvider = ({ children }: PropsWithChildren) => {
  const { treasury, loading, firstLoading } = useProjectOne();
  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<
    TransactionType[]
  >([]);

  const [filters, setFilters] = useState<FilterType>({});
  const [sorter, setSorter] = useState<{
    key: SorterType;
    direction: DirectionSort;
  } | null>(null);

  const [itemOpenModal, setItemOpenModal] = useState<TransactionType | null>(
    null
  );
  const [transactionsSelectIdx, setTransactionsSelectIdx] = useState<
    number[] | null
  >(null);
  const [isLoadingDownload, toggleDownload] = useTraceSync();
  const [isLoadingLatest, _, { onHidden }] = useToggle(true);
  const [isOpenModalTransaction, toggleModalTransaction] = useToggle();
  const [limit, setLimit] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState(1);

  const internalPath = useMemo(() => {
    if (!treasury?.id) return null;

    return path;
  }, [treasury?.id]);

  const { data, isLoading, mutate } = useSWR<PaginationServer<TransactionType>>(
    {
      url: internalPath,
      params: {
        filters: resolveParams(filters),
        project: treasury?.id,
        sort: sorter
          ? `${sorter?.key}:${sorter?.direction === 'ascend' ? 'asc' : 'desc'}`
          : undefined,
        pagination: {
          pageSize: limit,
          page: pageIndex
        }
      }
    },
    fetcher
  );

  const onSetFilter = useCallback((newFilters: FilterType) => {
    const cleanFilters = Object.entries(newFilters).reduce(
      (acc, [key, value]) => {
        if (value === undefined || value === null || value === '') {
          return acc;
        }
        (acc as any)[key] = value;
        return acc;
      },
      {} as FilterType
    );
    setFilters(cleanFilters);
  }, []);

  const onChangeSorter = useCallback(
    (key: SorterType, direction: DirectionSort | null) => {
      setSorter(direction ? { key, direction } : null);
    },
    []
  );

  const updateItemInCache = useCallback(
    async (item: TransactionType) => {
      if (!data?.data) return null;
      const deepArray = [...data.data];

      const findIndexItem = deepArray.findIndex(
        (element) => element.id === item.id
      );

      deepArray[findIndexItem] = item;

      await mutate({ ...data, data: deepArray });
    },
    [data, mutate]
  );

  const onChangePage = useCallback((newPage: number) => {
    setPageIndex(newPage);
  }, []);

  const onSelectModal = (id: number) => {
    setTransactionsSelectIdx(null);
    const find = data?.data.find((f) => f.id === id);
    if (find) {
      setItemOpenModal(find);
    }
    toggleModalTransaction();
  };

  const onEditRows = (idx: number[]) => {
    setItemOpenModal(null);
    setTransactionsSelectIdx(idx?.length ? idx : null);

    toggleModalTransaction();
  };

  const onClearSelectedModal = () => {
    setTransactionsSelectIdx(null);
    setItemOpenModal(null);
  };

  const getWalletFrom = useCallback(
    (wallet: string) => {
      return allTransactions.find(
        (item) => item.walletAddressTrack?.address === wallet
      );
    },
    [allTransactions]
  );

  const onDownloadFile = useCallback(() => {
    if (!treasury?.id)
      return message.error('Please waiting a moment and retry');

    return toggleDownload(async () => {
      message.info('Please waiting a moment, we are preparing your file');
      let currentPage = 1;
      let tryThis = 3;
      let isContinuesFetch = true;
      const allTransactionsForFile: TransactionType[] = [];

      while (isContinuesFetch && !!tryThis) {
        try {
          const { data } = await api.get<PaginationServer<TransactionType>>(
            `${API_ROUTES.GET_ALL_TRANSACTIONS.path}`,
            {
              params: {
                project: treasury?.id,
                pagination: {
                  page: currentPage,
                  pageSize: 100
                }
              }
            }
          );
          allTransactionsForFile.push(...data.data);

          currentPage++;
          isContinuesFetch =
            data.meta.pagination.page < data.meta.pagination.pageCount;
        } catch (e) {
          tryThis--;
          console.log(e);
          message.error(formatErrorMessage(e));
        }
      }

      const headerString = [
        '#',
        'katana ID',
        'Trx',
        'Direction',
        'Date',
        'Description',
        'Wallet From',
        'Wallet To',
        'Amount',
        'Amount Market Value ($USD)',
        'Category'
      ].join(GET_SEPARATOR_FILE);

      const bodyString = allTransactionsForFile.map((item, index) => {
        return [
          index + 1,
          item.id,
          item.signature,
          item.direction,
          formatDateTime(item.date),
          item.description,
          item.fromUserAccount,
          item.toUserAccount,
          item.amountFormatted.amount,
          new BigNumber(item.amountFormatted.usd).dp(2).toString(),
          item?.tag?.name
        ].join(GET_SEPARATOR_FILE);
      });

      const csvString = [headerString, ...bodyString].join('\n');

      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'transactions.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }, [toggleDownload, treasury?.id]);

  const balance = useMemo(() => {
    return allTransactions
      .reduce((before, current) => {
        return before.plus(current?.amount);
      }, new BigNumber(0))
      .toNumber();
  }, [allTransactions]);

  const dataOut = useMemo(() => {
    if (data?.data) {
      return {
        ...data,
        data: data.data.map((item, index) => ({
          key: item.id,
          index: index + 1,
          ...item
        }))
      };
    }
    return null;
  }, [data]);

  useEffect(() => {
    if (dataOut?.data) {
      setLatestTransactions((prev) => {
        onHidden();

        if (!prev.length) {
          return dataOut.data.slice(0, 10);
        }
        return prev;
      });
    }
  }, [dataOut, onHidden]);

  return (
    <TransactionsContext.Provider
      value={{
        onChangePage,
        internalPath,
        updateItemInCache,
        getWalletFrom,
        balance,
        downloadFile: onDownloadFile,
        setLimit,
        filters,
        onChangeSorter,
        onSetFilter,
        latestTransactions,
        isLoadingLatest,
        isLoadingDownload,
        selectedRows: transactionsSelectIdx,
        onEditRows,
        transactionsCount: data?.meta?.pagination?.total || 0,
        pagination: dataOut,
        transactions: allTransactions,
        loading: isLoading || firstLoading || loading,
        toggleModalTransaction: onSelectModal,
        transactionLoading: isLoading
      }}
    >
      {children}
      <ModalEditTransaction
        data={itemOpenModal}
        transactionIds={transactionsSelectIdx}
        isOpen={isOpenModalTransaction}
        onClose={() => {
          onClearSelectedModal();
          toggleModalTransaction();
        }}
      />
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
