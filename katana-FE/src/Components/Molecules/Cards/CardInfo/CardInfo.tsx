import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Space, Spin } from 'antd';
import { ReactNode, useMemo } from 'react';

import Text from '@/Components/Atoms/Text';
import { formatMoney } from '@/utils/generalFormat';
import SolanaIcon from '@/Components/Atoms/Icons/Solana';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';
import { TextProps } from '@/Components/Atoms/Text/Text';
import { CardStyle } from '@/Components/Molecules/Cards/CardInfo/style';

type CardInfoProps = {
  label: string;
  value: string | number | ReactNode;
  subValue?: string | number;
  convertToUSD?: boolean;
  icon?: ReactNode;
  valueProps?: TextProps;
};

const CardInfo = ({
  label,
  value,
  convertToUSD,
  icon,
  subValue,
  valueProps
}: CardInfoProps) => {
  const { enabled, getAssetPrice } = useAssetPrice();

  const calculateValue = useMemo(() => {
    if (
      !enabled ||
      !convertToUSD ||
      (typeof value !== 'number' && typeof value !== 'string')
    ) {
      return '$0 USD';
    }
    const price = getAssetPrice(AssetAcceptedEnum.SOL);
    const valueInUSD = new BigNumber(price)
      .multipliedBy(value)
      .dp(2)
      .toString();

    return `$${formatMoney(valueInUSD)} USD`;
  }, [convertToUSD, enabled, getAssetPrice, value]);

  return (
    <CardStyle className="shadow-cardWrapper" bordered={false}>
      <Text withMargin={false}>{label}</Text>
      <Space>
        {icon !== undefined ? (
          icon
        ) : (
          <IconWrapper className="text-[1rem]">
            <SolanaIcon />
          </IconWrapper>
        )}
        <Text
          fontSize="1.2rem"
          overflowLines={1}
          weight="bold"
          {...valueProps}
          className={classNames(valueProps?.className)}
        >
          {typeof value === 'number' ? formatMoney(value) : value}
        </Text>
      </Space>
      {(convertToUSD || subValue) && (
        <Text color="text-secondaryText3">
          {!enabled ? <Spin size="small" /> : subValue || calculateValue}
        </Text>
      )}
    </CardStyle>
  );
};

export default CardInfo;
