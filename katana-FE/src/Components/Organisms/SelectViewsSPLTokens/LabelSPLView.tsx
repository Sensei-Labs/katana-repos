import { Space } from 'antd';
import { SPLTransactionsType } from '@/Contexts/Projects/types';
import CoinIcon from '@/Components/Atoms/Icons/Coin';
import Text from '@/Components/Atoms/Text';
import { formatMoney } from '@/utils/generalFormat';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';

const PRICE_UNITS = 1000000;

export default function LabelSPLView({
  symbol,
  mintAddress,
  name,
  image,
  price,
  amount
}: SPLTransactionsType) {
  return (
    <div className="flex justify-between items-center gap-3 w-full">
      {/* first column */}
      <Space className="flex-[0.5]">
        {image ? (
          <a target="_blank" href={`https://solscan.io/token/${mintAddress}`}>
            <img
              src={image}
              className="rounded object-cover"
              style={{ width: 25, height: 25 }}
            />
          </a>
        ) : (
          <CoinIcon style={{ width: 18, height: 18 }} />
        )}
        {symbol || name ? (
          <div>
            <Text className="font-black">{name}</Text>
            <Text color="text-secondaryText2" fontSize="1rem">
              {symbol}
            </Text>
          </div>
        ) : (
          <Text>{mintAddress.slice(0, 9)}...</Text>
        )}
      </Space>

      {/* second column */}
      <div className="flex-[0.25]">
        {amount && price ? (
          <>
            <Text className="font-black">{formatMoney(amount, 'auto')}</Text>
            <Text color="text-secondaryText2" fontSize="0.8rem">
              ${formatMoney(price / PRICE_UNITS)}
            </Text>
          </>
        ) : (
          <Text>{formatMoney(amount, 'auto')}</Text>
        )}
      </div>

      {/* third column */}
      <div className="flex-[0.25]">
        {amount && price && (
          <Text>${formatMoney((price / PRICE_UNITS) * amount)}</Text>
        )}
      </div>
    </div>
  );
}
