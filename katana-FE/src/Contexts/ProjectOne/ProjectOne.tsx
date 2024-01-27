import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

import { asyncForMap } from '@/utils';
import { formatAmount } from '@/utils/generalFormat';
import { useProjectInfo } from '@/Contexts/ProjectOne/subContext/ProjectInfo';
import { useProjectSPLTokens } from '@/Contexts/ProjectOne/subContext/ProjectSPLTokens';
import { useProjectCollectionsInfo } from '@/Contexts/ProjectOne/subContext/ProjectCollectionsInfo';

import { BalanceType, TreasuryOneContextType } from '../Projects/types';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';
import BigNumber from 'bignumber.js';
import { APP_CUSTOM_RPC } from '@/config';

const defaultValues: TreasuryOneContextType = {
  treasury: null,
  loading: false,
  collectionCount: 0,
  SPLTransactions: [],
  firstLoading: true,
  accountBalances: [],
  SPLBalances: 0,
  SPLBalancesUsd: 0,
  totalSPLTokenAccount: 0,
  totalBalanceUsd: 0,
  NFTBalances: null,
  totalBalance: null,
  internalPath: '',
  totalAccountBalance: null,
  scopeTreasury: {
    canBeRead: false,
    canBeWrite: false,
    isCreator: false
  },
  nfts: [],
  collections: [],
  allCollections: [],
  infoCollectionsRaw: [],
  info: {
    floor_price: 0,
    listed: 0,
    holders: 0,
    volume_24_hours: 0,
    volume_all: 0,
    items: 0
  }
};

const TreasuryOneContext = createContext<TreasuryOneContextType>(defaultValues);

export const TreasuryOneProvider = ({ children }: PropsWithChildren) => {
  const { enabled, getAssetPrice } = useAssetPrice();

  const { scopeTreasury, treasury, isLoading, firstLoading, internalPath } =
    useProjectInfo();

  const {
    data: splTransactions,
    SPLBalances,
    SPLBalancesUsd,
    totalSPLTokenAccount,
    isLoading: isSplLoading
  } = useProjectSPLTokens();

  const {
    nfts,
    NFTBalances,
    allCollections,
    collections,
    collectionCount,
    infoCollectionsRaw,
    info,
    isLoading: loadingCollectionInfo
  } = useProjectCollectionsInfo();

  const [accountBalances, setAccountBalances] = useState<BalanceType[]>([]);

  const getAllBalance = useCallback(async () => {
    const connection = new Connection(APP_CUSTOM_RPC);
    const addresses = treasury?.treasuryAddresses?.map((item) => item.address);
    if (addresses?.length) {
      const balances = await asyncForMap(addresses, async (address) => {
        const newPublicKey = new PublicKey(address);
        const balance = await connection.getBalance(newPublicKey);
        return {
          address,
          balance
        };
      });
      setAccountBalances(balances);
    }
  }, [treasury?.treasuryAddresses]);

  const totalAccountBalance = useMemo(() => {
    const balance = accountBalances.reduce((previousValue, currentValue) => {
      return previousValue + currentValue?.balance;
    }, 0);

    return formatAmount(balance);
  }, [accountBalances]);

  useEffect(() => {
    getAllBalance();
  }, [getAllBalance]);

  const totalBalance = useMemo(() => {
    return (NFTBalances || 0) + (totalAccountBalance.raw || 0);
  }, [NFTBalances, totalAccountBalance.raw]);

  const totalBalanceUsd = useMemo(() => {
    if (enabled) {
      const solPrice = getAssetPrice(AssetAcceptedEnum.SOL);

      const totalAccountBalanceUSD = new BigNumber(
        totalAccountBalance?.parserNumber || 0
      )
        .multipliedBy(solPrice || 0)
        .toNumber();

      return new BigNumber(SPLBalancesUsd)
        .plus(totalAccountBalanceUSD)
        .dp(2)
        .toNumber();
    }

    return 0;
  }, [
    SPLBalancesUsd,
    enabled,
    getAssetPrice,
    totalAccountBalance?.parserNumber
  ]);

  const isFirstLoading =
    firstLoading || isLoading || !treasury || loadingCollectionInfo;

  return (
    <TreasuryOneContext.Provider
      value={{
        nfts,
        scopeTreasury,
        collections,
        allCollections,
        accountBalances,
        totalAccountBalance,
        info,
        SPLBalances,
        SPLBalancesUsd,
        totalBalanceUsd,
        totalSPLTokenAccount,
        SPLTransactions: splTransactions,
        totalBalance: formatAmount(totalBalance),
        infoCollectionsRaw,
        NFTBalances,
        internalPath,
        collectionCount: collectionCount,
        treasury,
        firstLoading: isFirstLoading,
        loading: isFirstLoading || loadingCollectionInfo || isSplLoading
      }}
    >
      {children}
    </TreasuryOneContext.Provider>
  );
};

export const useProjectOne = () => useContext(TreasuryOneContext);
