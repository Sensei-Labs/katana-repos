import { fetchSplTokensInstance } from '../../../services/fetch';

type CollectionType = {
  collection_id: string;
  solscanId: string;
  magicEdenSymbol: string;
  floor_price: number;
  holders: number;
  items: number;
  last_trade_id: string;
  last_trade_time: string;
  collection_name: string;
  nft_family: string;
  nft_image: string;
  total_attributes: number;
  volume_24_hours: number;
  listed: number;
  volume: number;
  volume_all: number;
  marketplaces: string[];
};

const fetchCollectionInfo = async (projectId: number) => {
  try {
    const { data } = await fetchSplTokensInstance.get<{ collectionInfo: CollectionType[] }>(`/projects/${projectId}`);

    return {
      data: data.collectionInfo,
      error: null
    };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: e
    };
  }
};

export async function getCollectionsInfoFromCache(treasuryId) {
  const { data } = await fetchCollectionInfo(treasuryId);
  return data || [];
}
