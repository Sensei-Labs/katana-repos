import useSWR from 'swr';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { fetcher } from '@/services/api';
import {
  ProjectSPLTransactionsType,
  SPLTransactionsType
} from '@/Contexts/Projects/types';
import { getSPLTransferFromProject } from '@/fetches/treasury';
import { useProjectInfo } from '@/Contexts/ProjectOne/subContext/ProjectInfo';
import { formatAmount, getDecimalsNumber } from '@/utils/generalFormat';
import { asyncForMap } from '@/utils';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';

const ProjectSPLTokensContext = createContext<
  ProjectSPLTransactionsType & {
    data: SPLTransactionsType[];
    isLoading: boolean;
  }
>({
  data: [],
  SPLBalances: 0,
  SPLBalancesUsd: 0,
  totalSPLTokenAccount: 0,
  isLoading: true
});

type ServerResponse = {
  ownerAddress: string;
  transactions: SPLTransactionsType[];
};

export const ProjectSPLTokensProvider = ({ children }: PropsWithChildren) => {
  const { treasury } = useProjectInfo();
  const { getAmountInUsd } = useAssetPrice();
  const { data, isLoading } = useSWR<SPLTransactionsType[]>(
    getSPLTransferFromProject(treasury?.id),
    fetcher
  );

  const [transactionsFormatted, setTransactionsFormatted] = useState<
    SPLTransactionsType[]
  >([]);

  const allSplTransactions = useMemo<SPLTransactionsType[]>(() => {
    if (!data?.length) return [];
    return data;
  }, [data]);

  const SPLBalances = useMemo(() => {
    return allSplTransactions.reduce((acc, cur) => {
      const newAmount = cur?.amount || 0;
      return acc + newAmount;
    }, 0);
  }, [allSplTransactions]);

  const SPLBalancesUsd = useMemo(() => {
    return transactionsFormatted.reduce(
      (acc, cur) => acc + (cur.priceUsd * cur.amount || 0),
      0
    );
  }, [transactionsFormatted]);

  useEffect(() => {
    (async () => {
      const allResolvePriceTransactions = await asyncForMap(
        allSplTransactions,
        async (transaction) => {
          if (!!transaction.priceUsd) return transaction;
          if (!transaction.priceSol) return transaction;
          const priceUsd = getAmountInUsd(
            AssetAcceptedEnum.SOL,
            transaction.priceSol
          );
          return {
            ...transaction,
            priceUsd
          };
        }
      );

      setTransactionsFormatted(
        allResolvePriceTransactions.sort((a, b) => {
          const valueA = Number(a?.priceUsd || 0) * Number(a?.amount || 0);
          const valueB = Number(b?.priceUsd || 0) * Number(b?.amount || 0);

          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
          return 0;
        })
      );
    })();
  }, [allSplTransactions, getAmountInUsd]);

  return (
    <ProjectSPLTokensContext.Provider
      value={{
        data: transactionsFormatted,
        totalSPLTokenAccount: allSplTransactions.length,
        SPLBalances,
        SPLBalancesUsd,
        isLoading
      }}
    >
      {children}
    </ProjectSPLTokensContext.Provider>
  );
};

export const useProjectSPLTokens = () => useContext(ProjectSPLTokensContext);
