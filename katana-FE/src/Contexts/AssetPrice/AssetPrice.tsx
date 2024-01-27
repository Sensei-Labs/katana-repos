import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { ASSET_SERVER_URL } from '@/config';
import useToggle from '@/hooks/useToggle';
import { useScope } from '@/Contexts/Scope';
import BigNumber from 'bignumber.js';

export enum AssetAcceptedEnum {
  'SOL' = 'SOL',
  'USDC' = 'USDC'
}

export type AssetsPriceType = {
  price: number;
  volume_change_24h: number;
  percent_change_24h: number;
  symbol: AssetAcceptedEnum;
};

type AssetPriceContextType = {
  enabled: boolean;
  allAssets: AssetsPriceType[];
  getAssetPrice(asset: AssetAcceptedEnum): number;
  getAsset(asset: AssetAcceptedEnum): AssetsPriceType | null;
  getAmountInUsd(
    asset: AssetAcceptedEnum,
    value: string | number,
    defaultValue?: number
  ): number;
};

const defaultValues: AssetPriceContextType = {
  allAssets: [],
  enabled: false,
  getAssetPrice() {
    return 0;
  },
  getAmountInUsd() {
    return 0;
  },
  getAsset() {
    return null;
  }
};

const AssetsContext = createContext<AssetPriceContextType>(defaultValues);

export const AssetPriceProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useScope();
  const [enabled, _, { onVisible }] = useToggle();
  const [allAssets, setAllAssets] = useState<AssetsPriceType[]>([]);

  const getAssetPrice = useCallback(
    (symbol: AssetAcceptedEnum) => {
      if (!allAssets?.length) return 0;
      if (symbol.toUpperCase() === AssetAcceptedEnum.USDC) return 1;
      const findAsset = allAssets.find((asset) => asset.symbol === symbol);
      return findAsset?.price || 0;
    },
    [allAssets]
  );

  const getAmountInUsd = useCallback(
    (
      symbol: AssetAcceptedEnum,
      value: number | string,
      defaultValue: number = 0
    ) => {
      if (!allAssets?.length) return defaultValue;

      if (symbol === AssetAcceptedEnum.USDC) {
        return new BigNumber(value).toNumber();
      }

      const findAsset = allAssets.find((asset) => asset.symbol === symbol);
      const currentPrice = findAsset?.price || 0;

      return new BigNumber(value).multipliedBy(currentPrice).toNumber();
    },
    [allAssets]
  );

  const getAsset = useCallback(
    (symbol: AssetAcceptedEnum) => {
      if (!allAssets?.length) return null;
      const findAsset = allAssets.find((asset) => asset.symbol === symbol);
      return findAsset || null;
    },
    [allAssets]
  );

  // assets server
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      const startSocket = () => {
        const socket = new WebSocket(ASSET_SERVER_URL);
        // Connection opened
        socket.addEventListener('open', () => {
          onVisible();
          console.log('AssetPrice server connection opened');
          socket.send(JSON.stringify(['SOL', 'USDC']));
        });

        socket.addEventListener('message', (event) => {
          console.log('AssetPrice new price received');
          const data = JSON.parse(event.data.toString());
          data && setAllAssets(data);
        });

        socket.onclose = function (e) {
          console.log(
            'Socket is closed. Reconnect will be attempted in 1 second.',
            e.reason
          );
          setTimeout(function () {
            startSocket();
          }, 1000);
        };

        socket.onerror = function (event) {
          console.error('Socket encountered error closing socket');
          socket.close();
        };
      };

      startSocket();
    }
  }, [onVisible, isAuthenticated]);

  return (
    <AssetsContext.Provider
      value={{
        enabled,
        getAsset,
        allAssets,
        getAssetPrice,
        getAmountInUsd
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssetPrice = () => useContext(AssetsContext);
