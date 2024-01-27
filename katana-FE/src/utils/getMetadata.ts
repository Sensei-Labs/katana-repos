import axios from 'axios';
import { HELIUS_API_KEY } from '@/config';
import { asyncForMap } from '@/utils/index';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { NFTTokenType } from '@/Contexts/Scope/types';

export const getTransactionFromAddress = async (
  address: string
): Promise<TransactionHeliusType | null> => {
  try {
    const { data } = await axios.get<TransactionHeliusType>(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`
    );
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getTransactionFromAddresses = async (
  addresses: string[]
): Promise<TransactionReturnType[]> => {
  const output = await asyncForMap(addresses, async (address) => {
    const transactions = await getTransactionFromAddress(address);
    if (!transactions || transactions?.transactionError) return null;
    return {
      address,
      transactions
    };
  });

  return output.filter((f) => !!f) as unknown as TransactionReturnType[];
};

export const getMetadataFromURL = async <T = any>(
  url: string,
  extraData?: any
): Promise<T | null> => {
  try {
    const { data } = await axios.get<T>(url, { timeout: 100000 });
    return { ...data, ...extraData };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getMetadataFromBlockChain = async (
  mintAddresses: string[]
): Promise<TokenHeliusType[] | null> => {
  try {
    const { data } = await axios.post<TokenHeliusType[]>(
      `https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`,
      {
        mintAccounts: mintAddresses
      }
    );
    return data || null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getCollectionMintListBlockChain = async (
  collectionList: string[]
): Promise<any[] | null> => {
  try {
    const { data } = await axios.post<TokenHeliusType[]>(
      `https://api.helius.xyz/v1/nft-events?api-key=${HELIUS_API_KEY}`,
      {
        query: {
          types: ['NFT_MINT'],
          firstVerifiedCreators: collectionList
        },
        options: {
          limit: 10000
        }
      }
    );
    return data || null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getNFTListFromBlockChain = async (
  treasuryWallets: string[]
): Promise<any[] | null> => {
  try {
    const { data } = await axios.post<TokenHeliusType[]>(
      `https://api.helius.xyz/v1/nft-events?api-key=${HELIUS_API_KEY}`,
      {
        query: {
          types: ['NFT_MINT'],
          accounts: treasuryWallets
        }
      }
    );

    // const collectionList = data?.result?.map(() => '');

    return data || null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getNFTForUserFromBlockChain = async ({
  userAddress,
  connection
}: {
  userAddress: string;
  connection: Connection;
}): Promise<{ data: NFTTokenType[] | null; errors: null | string }> => {
  try {
    const metaplex = new Metaplex(connection);
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: new PublicKey(userAddress)
    });

    const fetchMapMetaForNfts = await asyncForMap(nfts, async (meta) => {
      return (await getMetadataFromURL(
        meta.uri,
        meta
      )) as unknown as NFTTokenType;
    });

    const allNftWithMetadata = fetchMapMetaForNfts.filter((f) => f);
    return {
      data: allNftWithMetadata,
      errors: null
    };
  } catch (error: any) {
    console.log(error);

    return {
      data: null,
      errors: error?.message
    };
  }
};
