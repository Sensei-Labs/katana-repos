import Utils from '../../../utils';
import { fetchMagicEdenInstance, fetchSplTokensInstance } from '../../../services/fetch';

const LIMIT = 100;

type WorkerToken = {
  owner: string;
  mintAddress: string;
  name?: string;
  symbol?: string;
  image?: string;
  amount?: number;
  priceUsd?: number;
  priceSol?: number;
};

export const fetchNftMarketInfo = async (tokenMint: string) => {
  try {
    const { data } = await fetchSplTokensInstance.get<WorkerToken>(`/tokens/get-metadata/${tokenMint}`);
    return {
      data: data,
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

const fetchNFTs = async (account, offset, limit = LIMIT) => {
  try {
    const params = {
      offset,
      limit,
      listStatus: 'both'
    };

    const { data } = await fetchMagicEdenInstance.get(`/wallets/${account.address}/tokens`, { params });

    await Utils.asyncMap(data, async ({ mintAddress }, index) => {
      const { data: marketInfo } = await fetchNftMarketInfo(mintAddress);
      data[index].ownerAccount = account;
      data[index].marketInfo = marketInfo;
    });

    return {
      data,
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

const getAllNft = async (accountAddresses = [], acceptedCollectionAddress = []) => {
  const allNFTForAccount = [];

  await Utils.asyncMap(accountAddresses, async ({ id, address }) => {
    const account = { id, address };
    const { data, error } = await fetchNFTs(account, 0, LIMIT);
    if (!data?.length && !!error) return null;

    Utils.map(data, (nft) => {
      const findIndexCollection = allNFTForAccount.findIndex((item) => item.collectionInfo.collection === nft.collection);
      if (findIndexCollection === -1) {
        const show = acceptedCollectionAddress.includes(nft.collection);
        allNFTForAccount.push({
          show,
          tokens: [nft],
          collectionInfo: {
            collection: nft?.collection || '',
            collectionName: nft?.collectionName || ''
          }
        });
      } else {
        allNFTForAccount[findIndexCollection].tokens.push(nft);
      }
    });
  });

  return allNFTForAccount;
};

function cleanArray(array) {
  return Array.isArray(array) ? array : [];
}

export async function getNftFromAddressesInCache(projectId, accountAddresses = [], _acceptedCollectionAddress = []) {
  const acceptedCollectionAddress = cleanArray(_acceptedCollectionAddress);

  return await getAllNft(accountAddresses, acceptedCollectionAddress);
}
