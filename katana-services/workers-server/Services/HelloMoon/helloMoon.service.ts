import {
  RestClient,
  TokenBalancesByOwner,
  TokenBalancesByOwnerRequest,
  TokenPrice,
  TokenPriceRequest,
} from '@hellomoon/api';
import { asyncMap } from '../../Utils';

export const FORMAT_USD_UNITS = 1000000;

type GetTokenOutputData = TokenBalancesByOwner & { price: number; priceUsd: number };
type GetTokenPriceOutputData = TokenPrice & { priceUsd: number };

export default class HelloMoonService {
  private instance = new RestClient(process.env.APP_HELLO_MOON_API_KEY);

  async getTokenLatestPrice({ mint }: { mint: string }): Promise<GetTokenPriceOutputData> {
    const data = await this.instance.send(
      new TokenPriceRequest({
        mint,
      }),
    );

    if (!data.data.length) {
      data.data.push({
        mint,
        price: 0,
        volume: 0,
        startTime: 0,
      });
    }

    return {
      ...data.data[0],
      priceUsd: data.data[0].price / FORMAT_USD_UNITS,
    };
  }

  async getTokenBalanceByOwner({ ownerAccount }: { ownerAccount: string }) {
    const data = await this.instance.send(
      new TokenBalancesByOwnerRequest({
        ownerAccount,
      }),
    );

    console.log(data);
    return data.data;
  }

  async getTokenBalanceByOwnerWithPrices({
    ownerAccount,
  }: {
    ownerAccount: string;
  }): Promise<GetTokenOutputData[]> {
    const splTokens = await this.getTokenBalanceByOwner({ ownerAccount });
    const outputData: GetTokenOutputData[] = splTokens.map((token) => ({
      ...token,
      price: 0,
      priceUsd: 0,
    }));

    await asyncMap(outputData, async (token, index) => {
      try {
        const { price, priceUsd } = await this.getTokenLatestPrice({ mint: token.mint });
        outputData[index].price = price;
        outputData[index].priceUsd = priceUsd;
      } catch (e) {
        console.log(e);
      }
    });

    return outputData;
  }
}
