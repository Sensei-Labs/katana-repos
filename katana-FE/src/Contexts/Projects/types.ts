import { TreasuryType } from '@/Contexts/Projects/Treasuries';
import { NFTTokenType, ScopeAddType } from '@/Contexts/Scope/types';
import { FormatAmountType } from '@/utils/generalFormat';
import { FilterTypeValue } from '@/Contexts/Transactions/types';

export type BalanceType = {
  address: string;
  balance: number;
};

export type InfoCollectionTrack = {
  collection_id: string;
  collection_name: string;
  floor_price: number;
  holders: number;
  items: number;
  last_trade_id: string;
  last_trade_time: string;
  marketplaces: string[];
  nft_family: string;
  nft_image: string;
  total_attributes: string;
  listed: number;
  volume_24_hours: number;
  volume_all: number;
};

export enum ResponseStatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export type InfoType = Pick<
  InfoCollectionTrack,
  | 'volume_24_hours'
  | 'volume_all'
  | 'holders'
  | 'floor_price'
  | 'listed'
  | 'items'
>;

export interface SPLTransactionsType {
  amount: number;
  image: string;
  mintAddress: string;
  name: string;
  priceSol: number;
  price: number;
  priceUsd: number;
  symbol: string;
  _id: string;
}

export interface ProjectCollectionsInfo {
  collections: CollectionType[];
  allCollections: CollectionType[];
  info: InfoType;
  collectionCount: number;
  NFTBalances: number | null;
  nfts: NFTTokenType[];
  infoCollectionsRaw: InfoCollectionTrack[];
  isLoading: boolean;
}

export type MoreLinksType = {
  label: string;
  link: string;
  icon: string;
};

export interface ProjectInfoType {
  internalPath: string;
  scopeTreasury: ScopeAddType;
  treasury: TreasuryType | null;
  firstLoading: boolean;
  error: null | any;
  isLoading: boolean;
  moreLinks?: MoreLinksType[];
}

export interface ProjectSPLTransactionsType {
  SPLBalances: number;
  SPLBalancesUsd: number;
  totalSPLTokenAccount: number;
}

export type TreasuryOneContextType = Omit<ProjectCollectionsInfo, 'isLoading'> &
  Omit<ProjectInfoType, 'isLoading' | 'error'> &
  ProjectSPLTransactionsType & {
    loading: boolean;
    SPLTransactions: SPLTransactionsType[];
    accountBalances: BalanceType[];
    totalAccountBalance: FormatAmountType | null;
    totalBalance: FormatAmountType | null;
    totalBalanceUsd: number;
  };

export enum FilterKeyEnum {
  TAGS = 'tags',
  SEARCH = 'search'
}

export type FilterType = {
  [key in FilterKeyEnum]?: FilterTypeValue;
};
