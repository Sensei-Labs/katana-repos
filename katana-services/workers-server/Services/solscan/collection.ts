import solscanInstance from '../../Config/Fetch/solscanInstance';

export type SolscanCollection = {
  last_trade_id: string;
  collection_id: string;
  volume: number;
  collection_name: string;
  nft_image: string;
  nft_family: string;
  items: string;
  holders: string;
  total_attributes: string;
  floor_price: number;
  last_trade_time: string;
  marketplaces: string[];
};

export async function getCollectionInfo(solscanID: string): Promise<{ data: SolscanCollection | null; errors: any }> {
  try {
    const { data } = await solscanInstance.get<{ data: SolscanCollection[]; code: number }>(
      `https://pro-api.solscan.io/v1.0/public/nft/collection/overview?collection_id=${solscanID}&range=1&cluster=`,
    );

    if (data.code === 200 && data?.data?.length) {
      return {
        data: data.data[0],
        errors: null,
      };
    }

    return {
      data: null,
      errors: null,
    };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      errors: e,
    };
  }
}
