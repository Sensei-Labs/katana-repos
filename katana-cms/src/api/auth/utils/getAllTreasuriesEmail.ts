import { Strapi } from '@strapi/strapi';

export async function getAllTreasuriesEmail(strapi: Strapi) {
  const data =
    (await strapi.db.query('api::treasury.treasury').findMany({
      populate: {
        acceptedCollectionAddress: true,
        collection_nfts_addresses: true,
        frontPage: true,
        thumbnail: true,
        creator: true,
        treasuryAddresses: true
      } as any
    })) || [];

  return data.map((item) => {
    return {
      ...item,
      creator: item?.creator
        ? {
            id: item.creator.id,
            email: item.creator.email
          }
        : null
    };
  });
}
