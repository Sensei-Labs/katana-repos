import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMetadataFromBlockChain } from '@/utils/getMetadata';

const LIMIT = 8;
export default function usePaginationNFT(nftListAddresses: string[]) {
  const [isValidNext, setIsValidNext] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [nftList, setNftList] = useState<TokenHeliusType['offChainData'][]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const countTokens = useMemo(
    () => nftListAddresses.length,
    [nftListAddresses]
  );

  const getInitialData = useCallback(
    (startCount: number, endCount: number, getListTokenMints?: string[]) => {
      const list = getListTokenMints || nftListAddresses;
      const addressesTokens = list.slice(startCount, endCount);
      getMetadataFromBlockChain(addressesTokens).then((res) => {
        if (!res) return;
        const data = res.map((item) => ({ ...item.offChainData }));
        setNftList((prev) => [...prev, ...data]);
        return setLoading(false);
      });
    },
    [nftListAddresses]
  );

  const onNext = useCallback(() => {
    const startCount = page * LIMIT;
    const newPage = page + 1;
    setPage(newPage);

    const endCount = newPage * LIMIT;
    getInitialData(startCount, endCount);
  }, [getInitialData, page]);

  const onPrev = useCallback(() => {
    setPage((prev) => prev - 1);
  }, []);

  useEffect(() => {
    const countFetchers = page * LIMIT;
    if (countFetchers <= countTokens) {
      setIsValidNext(true);
    } else {
      setIsValidNext(false);
    }
  }, [countTokens, page]);

  return {
    isValidNext,
    getInitialData,
    onNext,
    onPrev,
    nftList,
    loading,
    isValidPrev: page > 1
  };
}
