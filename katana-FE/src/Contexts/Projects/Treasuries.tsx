import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import useSWR from 'swr';
import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';
import { validateArray } from '@/utils';
import { MilestoneType } from '@/types/milestone';
import { FilterType, MoreLinksType } from '@/Contexts/Projects/types';
import { resolveParams } from '@/Contexts/Projects/utils';
import usePagination from '@/hooks/usePagination';

export type AdminType = {
  id: number;
  walletAddress: string;
};

export type TreasuryAddressType = {
  address: string;
  id: number;
  label: string;
  color: string;
};

export interface TreasuryType {
  id: number;
  name: string;
  description: string;
  discordLink?: string;
  websiteLink?: string;
  twitterUser?: string;
  collectionCount: number;
  tags?: {
    id: string;
    name: string;
  }[];
  collection_nfts_addresses: any[];
  treasuryAddresses: TreasuryAddressType[] | null;
  creator: {
    walletAddress: string;
  };
  canBeWrite: AdminType[];
  principalColor?: string;
  secondaryColor?: string;
  thumbnail?: FileServerType;
  frontPage?: FileServerType;
  collections?: FileServerType[] | null;
  acceptedCollectionAddress: string[];
  moreLinks: MoreLinksType[];
  milestones: MilestoneType[];
}

export interface TreasuryContextType {
  list: TreasuryType[];
  loading: boolean;
  limit: number;
  filters: FilterType;
  isExistNextPage: boolean;
  onNextPage: () => void;

  setFilters(params: Partial<FilterType>): void;
}

const defaultValues: TreasuryContextType = {
  list: [],
  setFilters: () => {},
  loading: true,
  limit: 10,
  filters: {},
  onNextPage: () => {},
  isExistNextPage: false
};

const TreasuriesContext = createContext<TreasuryContextType>(defaultValues);
const path = `${API_ROUTES.GET_ALL_TREASURIES.path}`;

export const TreasuryProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState<FilterType>({});
  const [rows, setRows] = useState<Record<number, TreasuryType[]>>({});

  const { onNextPage, page, limit } = usePagination();

  const { data, isLoading } = useSWR<ResponseServer<TreasuryType[]>>(() => {
    if (typeof window === 'undefined') return null;
    return {
      url: path,
      params: {
        filters: resolveParams(filters),
        pagination: {
          page,
          pageSize: limit
        }
      }
    };
  }, fetcher);

  const onSetFilters = useCallback((params: FilterType) => {
    setRows({});
    setTimeout(() => {
      setFilters(params);
    }, 100);
  }, []);

  const list = useMemo(() => {
    return Object.values(rows).flat() || [];
  }, [rows]);

  const isEmptyData = useMemo(() => {
    return !Object.values(rows).flat().length && !isLoading;
  }, [isLoading, rows]);

  useEffect(() => {
    if ((!isLoading && data?.data) || isEmptyData) {
      setRows((prev) => ({
        ...prev,
        [page]:
          data?.data?.map((item) => {
            const acceptedCollectionAddress = validateArray(
              item?.acceptedCollectionAddress
            );
            return {
              ...item,
              collectionCount: item?.collection_nfts_addresses?.length || 0,
              acceptedCollectionAddress
            };
          }) || []
      }));
    }
  }, [page, isLoading, data, isEmptyData]);

  return (
    <TreasuriesContext.Provider
      value={{
        list: list,
        setFilters: onSetFilters,
        onNextPage,
        limit,
        filters,
        loading: isLoading,
        isExistNextPage: page < (data?.meta?.pagination?.pageCount || 0)
      }}
    >
      {children}
    </TreasuriesContext.Provider>
  );
};

export const useTreasuryList = () => useContext(TreasuriesContext);
