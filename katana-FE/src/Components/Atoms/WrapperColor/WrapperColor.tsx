import classNames from 'classnames';
import { ReactNode } from 'react';
import type { ColorType } from '@/styles/theme';

import { TitleStyle, WrapperStyle } from './style';

type WrapperColorProps = BaseComponent & {
  bgColor?: ColorType;
  children?: ReactNode;
  title?: string;
};

const WrapperColor = ({
  children,
  className,
  title,
  bgColor = 'wrapper',
  ...rest
}: WrapperColorProps) => {
  return (
    <WrapperStyle
      $color={bgColor}
      className={classNames(
        'shadow-cardWrapper',
        'rounded-lg p-2 sm:p-5',
        className
      )}
      {...rest}
    >
      {title && (
        <TitleStyle className="relative w-full mb-3">
          <div className="text relative font-bold">{title}</div>
          <div className="line" />
        </TitleStyle>
      )}
      {children}
    </WrapperStyle>
  );
};

export default WrapperColor;
