import { getCollectionInfo } from '../solscan/collection';
import { ICollectionInfo } from '../../Modules/Collection/Models/Collection.model';
import { fetchCollectionExtraInfo } from '../magicEden';

export const fetchCollectionInfo = async (solscanId, magicEdenSymbol) => {
  const dataOutput: ICollectionInfo = {
    collection_id: '',
    collection_name: '',
    floor_price: 0,
    holders: 0,
    items: 0,
    last_trade_id: '',
    last_trade_time: '',
    marketplaces: [],
    nft_image: '',
    total_attributes: 0,
    volume_24_hours: 0,
    volume: 0,
    magicEdenSymbol,
    nft_family: '',
    solscanId,
    volume_all: 0,
    listed: 0,
  };

  try {
    const { data: collection } = await getCollectionInfo(solscanId);

    if (collection) {
      dataOutput.collection_id = collection.collection_id;
      dataOutput.floor_price = collection.floor_price;
      dataOutput.holders = Number(collection.holders);
      dataOutput.items = Number(collection.items);
      dataOutput.last_trade_id = collection.last_trade_id;
      dataOutput.last_trade_time = collection.last_trade_time;
      dataOutput.marketplaces = collection.marketplaces;
      dataOutput.nft_image = collection.nft_image;
      dataOutput.nft_family = collection.nft_family;
      dataOutput.collection_name = collection.collection_name;
      dataOutput.total_attributes = Number(collection.total_attributes);
      dataOutput.volume = Number(collection.volume);
      dataOutput.volume_24_hours = Number(collection.volume);
    }

    try {
      const dataMagic = await fetchCollectionExtraInfo(magicEdenSymbol);
      if (dataMagic) {
        dataOutput.listed = dataMagic.listedCount;
        dataOutput.floor_price = dataMagic.floorPrice / 10 ** 9;
        dataOutput.volume_all = dataMagic.volumeAll;
      }
    } catch (e) {
      console.log(e);
    }

    return {
      data: dataOutput,
      error: null,
    };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: e,
    };
  }
};
