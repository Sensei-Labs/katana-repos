import classNames from 'classnames';
import Text from '@/Components/Atoms/Text';
import { NFTTokenType } from '@/types/nft';
import SolanaIcon from '@/Components/Atoms/Icons/Solana';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import { formatMoney } from '@/utils/generalFormat';

import { CardStyle, ResponsiveImage, ResponsiveWrapperImage } from './styles';

type NFTCardProps = BaseComponent & {
  image: string;
  name: string;
  description: string;
  floor?: string;
  totalFloor?: string;
  collectionName: string;
  isResponsive?: boolean;
  marketInfo?: NFTTokenType['marketInfo'];
  size?: 'small' | 'middle';
};

const sizes = {
  small: 150,
  middle: 245
};

const NFTCard = ({
  className,
  isResponsive = true,
  size = 'middle',
  style,
  ...nftData
}: NFTCardProps) => {
  const { image, collectionName, name, marketInfo } = nftData;

  const cx = [
    'rounded-t-3xl rounded-b-xl transition',
    {
      'object-cover': size === 'small'
    },
    {
      'object-contain': size === 'middle'
    }
  ];
  return (
    <CardStyle
      style={style}
      className={classNames(
        'shadow-cardWrapper',
        'rounded-3xl w-full cursor-pointer bg-card border border-solid border-card',
        className
      )}
    >
      <ResponsiveWrapperImage
        className={classNames(cx, 'bg-dark dark:bg-background')}
      >
        <ResponsiveImage
          src={image}
          width="100%"
          height={sizes[size]}
          $isResponsive={isResponsive}
          className={classNames(cx, 'hover:scale-105')}
        />
      </ResponsiveWrapperImage>
      <div className="px-2 pt-2 md:px-4 md:pt-4 rounded-b-3xl">
        <Text withMargin={false} weight="bold" fontSize={20}>
          {name}
        </Text>
        <Text withMargin={false} className="text-brand">
          {collectionName}
        </Text>
        {/*<Text withMargin={false} className="text-white">*/}
        {/*  Sold on:{' '}*/}
        {/*  <span className="text-brand font-bold">*/}
        {/*    {marketInfo?.dex ? marketInfo?.dex : '-'}*/}
        {/*  </span>*/}
        {/*</Text>*/}
      </div>
      <div className="p-2 md:p-4 rounded-b-3xl">
        <div className="flex gap-1">
          {!!marketInfo?.priceSol && (
            <IconWrapper>
              <SolanaIcon />
            </IconWrapper>
          )}{' '}
          <Text
            weight="bold"
            fontSize={20}
            withMargin={false}
            className="h-[20px]"
          >
            {marketInfo?.priceSol ? formatMoney(marketInfo.priceSol) : '-'}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text withMargin={false} className="h-[20px] mt-1">
            {!!marketInfo?.priceUsd
              ? `$${formatMoney(marketInfo.priceUsd)} USD`
              : '-'}
          </Text>

          {/*<Text withMargin={false}>*/}
          {/*  {marketInfo?.tradeTime ? formatDateAgo(marketInfo?.tradeTime) : ''}*/}
          {/*</Text>*/}
        </div>
      </div>
    </CardStyle>
  );
};

export default NFTCard;
