import connection from '../../Config/Web3';
import { PublicKey } from '../../Utils/web3';
import { asyncMap } from '../../Utils';
import { getTokenInfo } from '../solscan/tokens';
import { IToken } from '../../Modules/Token/Models/Token.model';
import HelloMoonService, { FORMAT_USD_UNITS } from '../HelloMoon/helloMoon.service';
import { fetchCollectionExtraInfo, fetchMagicEdenTokenInfo } from '../magicEden';
import metaplex from './metaplex';

export async function getTokenMetaInfoWithPrice({
  mintAddress,
  model,
  uiAmount = 0,
  owner = '',
}: {
  uiAmount?: number;
  mintAddress: string;
  model: 'sft' | 'nft';
  owner?: string;
}) {
  const output: Omit<IToken, 'updatedAt'> = {
    amount: uiAmount,
    name: '',
    image: '',
    symbol: '',
    price: 0,
    priceUsd: 0,
    priceSol: 0,
    model,
    mintAddress,
    owner,
  };

  if (model === 'nft') {
    const magicCollection = await fetchMagicEdenTokenInfo(mintAddress);
    if (magicCollection) {
      const dataMagic = await fetchCollectionExtraInfo(magicCollection.collection);
      if (dataMagic) {
        const priceSol = dataMagic.floorPrice / 1000000000;

        output.priceSol = priceSol;
        output.price = priceSol * FORMAT_USD_UNITS;
      }
    }
  } else {
    const { data: mintTokenInfo } = await getTokenInfo(output.mintAddress);

    if (mintTokenInfo) {
      const supply = Number(mintTokenInfo.supply || 0);
      output.name = mintTokenInfo.name;
      output.symbol = mintTokenInfo.symbol;
      output.image = mintTokenInfo.icon;
      output.price = mintTokenInfo.price * FORMAT_USD_UNITS;
      output.priceUsd = mintTokenInfo.price;

      if (!output.amount) {
        output.amount = supply === 1 ? 1 : uiAmount;
      }
    }

    if (!output.priceUsd) {
      const helloMoonInstance = new HelloMoonService();
      const dataPrice = await helloMoonInstance.getTokenLatestPrice({ mint: output.mintAddress });
      output.price = dataPrice.price;
      output.priceUsd = dataPrice.priceUsd;
    }
  }

  return output;
}

export async function getSplTokens(address: string): Promise<IToken[]> {
  const programIdKey = PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const walletAddressKey = PublicKey(address);

  const accountInfo = await connection.getParsedTokenAccountsByOwner(walletAddressKey, {
    programId: programIdKey,
  });

  // Verificar si la cuenta es una cuenta SPL y obtener las transacciones
  if (accountInfo.value.length > 0) {
    const returned = await asyncMap(accountInfo.value, async (token) => {
      try {
        const { model } = await metaplex.nfts().findByMint({
          mintAddress: PublicKey(token.account.data.parsed.info.mint),
        });

        return await getTokenMetaInfoWithPrice({
          uiAmount: token.account.data.parsed.info.tokenAmount.uiAmount,
          owner: token.account.data.parsed.info.owner,
          mintAddress: token.account.data.parsed.info.mint,
          model,
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    return returned.filter(Boolean);
  }
  console.log('La cuenta no es una cuenta SPL.');
  return [];
}
