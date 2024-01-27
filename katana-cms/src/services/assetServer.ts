import WebSocket from 'ws';
import { CurrencyEnum } from '../../@types/currencyEnums';
import { APP_ASSET_SERVER_URL } from '../config';
import BigNumber from 'bignumber.js';

type ListCurrentType = {
  symbol: CurrencyEnum;
  price: number;
};

let results: ListCurrentType[] = [];

export default function assetServer(assetList: CurrencyEnum[]) {
  const ws = new WebSocket(APP_ASSET_SERVER_URL);

  ws.on('open', function () {
    console.log('Conectado');
    ws.send(JSON.stringify(assetList));
  });

  ws.on('message', function (message: object) {
    try {
      const parseData = JSON.parse(message.toString());
      console.log(`New price got: ${message}`);
      if (Array.isArray(parseData)) {
        results = parseData as ListCurrentType[];
      }
    } catch (e) {
      console.log('Socket not working', e);
    }
  });

  ws.onclose = function (e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(function () {
      assetServer(assetList);
    }, 1000);
  };

  ws.onerror = function (err) {
    console.log(err);
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    ws.close();
  };

  function getAsset(symbol: CurrencyType) {
    return results.find((item) => item.symbol === symbol);
  }

  function getPrice(symbol: CurrencyType) {
    if (symbol === CurrencyEnum.USDC) return 1;
    const asset = getAsset(symbol);
    return asset?.price;
  }

  function getAmountFromPrice(symbol: CurrencyType, amount: number) {
    if (symbol === CurrencyEnum.USDC) return amount;
    const asset = getAsset(symbol);
    return new BigNumber(asset?.price || 0).multipliedBy(amount || 0).toNumber();
  }

  return {
    getAsset,
    getPrice,
    getAmountFromPrice,
    list: results
  };
}

export type AssetServerType = typeof assetServer;
