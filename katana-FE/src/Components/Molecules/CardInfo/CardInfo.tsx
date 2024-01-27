import { ReactNode, isValidElement, useMemo } from 'react';

import Text from '@/Components/Atoms/Text';
import { CardWrapper } from './style';

type CardInfoProps = {
  className?: string;
  label: string;
  labelClassName?: string;
  title?: string;
  value: ReactNode | number | boolean;
};

const CardInfo = ({
  label,
  value,
  className,
  title,
  labelClassName
}: CardInfoProps) => {
  const renderProps = useMemo<any>(() => {
    if (title)
      return {
        text: title
      };
    return {
      as: 'div'
    };
  }, [title]);

  return (
    <CardWrapper {...renderProps} className={className}>
      <div>
        <Text color="text-secondaryText2" className={labelClassName}>
          {label}
        </Text>
        {isValidElement(value) ? value : <Text weight="bold">{value}</Text>}
      </div>
    </CardWrapper>
  );
};

export default CardInfo;
