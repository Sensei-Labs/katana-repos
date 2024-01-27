export enum PeriodTransactionEnum {
  TODAY = 'today',
  LAST_WEEK = 'last_week',
  LAST_MONTH = 'last_month',
  LAST_THREE_MONTH = 'last_three_months',
  LAST_YEAR = 'last_year'
}

export enum AmountTransactionEnum {
  '0_10_SOL' = '0_10_SOL',
  '10_50_SOL' = '10_50_SOL',
  '50_100_SOL' = '50_100_SOL',
  'ABOVE_100_SOL' = 'above_100_SOL'
}

export enum FilterKeyEnum {
  DIRECTION = 'direction',
  ASSET = 'symbol',
  DATE_FROM = 'dateFrom',
  DATE_TO = 'dateTO',
  AMOUNT = 'amount',
  TAGS = 'tag',
  SEARCH = 'search'
}

export type FilterTypeValue = string | number | number[];

export type FilterType = {
  [key in FilterKeyEnum]?: FilterTypeValue;
};

export type DirectionSort = 'ascend' | 'descend';

export type SorterType = 'direction' | 'amount' | 'date';

export type TransactionsContextType = {
  pagination: PaginationServer<TransactionType> | null;
  onChangePage(newPage: number): void;
  updateItemInCache(item: TransactionType): void;
  onEditRows(idx: number[]): void;
  onSetFilter: (filters: FilterType) => void;
  onChangeSorter: (key: SorterType, direction: DirectionSort | null) => void;
  filters?: FilterType;
  selectedRows: number[] | null;
  transactions: TransactionType[];
  latestTransactions: TransactionType[];
  loading: boolean;
  isLoadingLatest: boolean;
  setLimit: (limit: number) => void;
  transactionLoading: boolean;
  isLoadingDownload: boolean;
  internalPath: string | null;
  balance: number;
  transactionsCount: number;
  toggleModalTransaction: (id: number) => void;
  downloadFile: () => void;
  getWalletFrom: (address: string) => TransactionType | undefined;
};
