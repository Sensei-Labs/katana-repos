import useSWR from 'swr';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useRouter } from 'next/router';

import { fetcher } from '@/services/api';
import {
  InfoCollectionTrack,
  InfoType,
  ProjectCollectionsInfo,
  ResponseStatusCode
} from '@/Contexts/Projects/types';
import { formatAmount } from '@/utils/generalFormat';
import { ROUTES } from '@/config';
import { NFTTokenType } from '@/Contexts/Scope/types';
import {
  getAllNftFromProject,
  getCollectionsInfoFromTreasury
} from '@/fetches/treasury';
import { getStatusErrorCode } from '@/utils/formatError';
import PaginationNFT from '@/Contexts/Projects/class/PaginationNFT';
import { useProjectInfo } from '@/Contexts/ProjectOne/subContext/ProjectInfo';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';

const ProjectCollectionsInfoContext = createContext<ProjectCollectionsInfo>({
  collections: [],
  allCollections: [],
  infoCollectionsRaw: [],
  collectionCount: 0,
  isLoading: true,
  nfts: [],
  NFTBalances: null,
  info: {
    floor_price: 0,
    listed: 0,
    holders: 0,
    volume_24_hours: 0,
    volume_all: 0,
    items: 0
  }
});

export const ProjectCollectionsInfoProvider = ({
  children
}: PropsWithChildren) => {
  const router = useRouter();
  const { getAmountInUsd } = useAssetPrice();
  const { treasury, error } = useProjectInfo();

  const [nfts, setNtfs] = useState<NFTTokenType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);
  const [infoCollectionsRaw, setInfoCollectionsRaw] = useState<
    InfoCollectionTrack[]
  >([]);

  const { data: nftOutput } = useSWR<
    {
      collectionInfo: any;
      show: boolean;
      tokens: NFTTokenType[];
    }[]
  >(getAllNftFromProject(treasury?.id), fetcher, {
    refreshInterval: 1000 * 60 * 5
  });

  const getNFTList = useCallback(async () => {
    if (treasury?.id && nftOutput) {
      setLoading(true);

      const outAllCollections: CollectionType[] = [];

      nftOutput.forEach((collection, key) => {
        const collectionPrice = collection.tokens.reduce((acc, cur) => {
          return acc + (cur?.marketInfo?.priceSol || 0);
        }, 0);
        console.log(collectionPrice);
        const collectionInfo = {
          ...collection.collectionInfo,
          collectionPrice,
          collectionPriceUsd: getAmountInUsd(
            AssetAcceptedEnum.SOL,
            collectionPrice
          )
        };

        const pagination = new PaginationNFT(collection.tokens);
        pagination.init();

        outAllCollections.push({
          key,
          totalCount: pagination.totalCount,
          address: collectionInfo.collection,
          name: collectionInfo.collectionName,
          collectionInfo: collectionInfo,
          page: pagination.page,
          docs: pagination.docs,
          onPrev: pagination.onPrev,
          isValidNext: pagination.isValidNext,
          tokenList: collection.tokens,
          isValidPrev: pagination.isValidPrev,
          onNext: () => {
            setAllCollections((prev) => {
              return prev.map((col) => {
                if (col.key !== key) return col;
                pagination.onNext();
                return {
                  ...col,
                  docs: pagination.docs,
                  isValidPrev: pagination.isValidPrev,
                  isValidNext: pagination.isValidNext,
                  page: pagination.page
                };
              });
            });
          }
        });
      });

      setAllCollections(outAllCollections);

      const _allNft: NFTTokenType[] = [];

      nftOutput.forEach(({ tokens, show }) => {
        const newTokens = tokens?.map((token) => ({ ...token, show })) || [];
        _allNft.push(...newTokens);
      });

      setNtfs(_allNft);
      setLoading(false);
    } else if (treasury) {
      setLoading(true);
    }
  }, [nftOutput, treasury, getAmountInUsd]);

  const getCollectionsInfo = useCallback(async () => {
    if (!treasury?.id) return;
    try {
      const { data } = await getCollectionsInfoFromTreasury<
        InfoCollectionTrack[]
      >(treasury?.id);
      setInfoCollectionsRaw(data);
    } catch (e) {
      console.error(e);
    }
  }, [treasury?.id]);

  useEffect(() => {
    getNFTList();
  }, [getNFTList]);

  useEffect(() => {
    getCollectionsInfo();
  }, [getCollectionsInfo]);

  useEffect(() => {
    if (!isLoading) {
      const codeError = getStatusErrorCode(error);
      if (codeError === ResponseStatusCode.NOT_FOUND) {
        router.push(ROUTES.NOT_FOUND.path);
      }
    }
  }, [error, getCollectionsInfo, isLoading, router]);

  const collections = useMemo(() => {
    if (
      !treasury?.acceptedCollectionAddress ||
      !treasury?.acceptedCollectionAddress?.length
    ) {
      return [];
    }

    return allCollections
      .filter((collection) =>
        treasury.acceptedCollectionAddress.includes(collection?.address || '')
      )
      .map((item, index) => ({ ...item, key: index }));
  }, [allCollections, treasury?.acceptedCollectionAddress]);

  const info = useMemo<InfoType>(() => {
    return infoCollectionsRaw.reduce(
      (previous, current) => {
        // previous + current.floor_price
        return {
          floor_price: previous.floor_price + current.floor_price,
          volume_all:
            previous.volume_all + formatAmount(current.volume_all).parserNumber,
          volume_24_hours: previous.volume_24_hours + current.volume_24_hours,
          holders: previous.holders + current.holders,
          listed: previous.listed + current.listed,
          items: previous.items + Number(current.items)
        } as InfoType;
      },
      {
        floor_price: 0,
        volume_all: 0,
        volume_24_hours: 0,
        holders: 0,
        listed: 0,
        items: 0
      }
    );
  }, [infoCollectionsRaw]);

  const NFTBalances = useMemo(() => {
    if (!nfts?.length) return 0;
    return nfts.reduce((previous, current) => {
      if (!(current as any)?.show) return previous;
      return previous + (current?.marketInfo?.priceSol || 0);
    }, 0);
  }, [nfts]);

  return (
    <ProjectCollectionsInfoContext.Provider
      value={{
        nfts,
        info,
        NFTBalances,
        allCollections,
        collections,
        infoCollectionsRaw,
        collectionCount: treasury?.collectionCount || 0,
        isLoading
      }}
    >
      {children}
    </ProjectCollectionsInfoContext.Provider>
  );
};

export const useProjectCollectionsInfo = () =>
  useContext(ProjectCollectionsInfoContext);
