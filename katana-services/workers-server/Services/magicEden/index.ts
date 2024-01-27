import magicEdenInstance from '../../Config/Fetch/magicEdenInstance';

export async function fetchCollectionExtraInfo(magicEdenSymbol: string) {
  try {
    const { data: dataMagic } = await magicEdenInstance.get<{
      listedCount: number;
      volumeAll: number;
      floorPrice: number;
    }>(`/collections/${magicEdenSymbol}/stats`);
    return {
      listedCount: dataMagic.listedCount,
      floorPrice: dataMagic.floorPrice,
      volumeAll: dataMagic.volumeAll,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function fetchMagicEdenTokenInfo(tokenAddress: string) {
  try {
    const { data: dataMagic } = await magicEdenInstance.get<{
      collection: string;
    }>(`/tokens/${tokenAddress}`);
    return dataMagic;
  } catch (e) {
    console.log(e);
    return null;
  }
}
