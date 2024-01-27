import React from 'react';
import Image from '@/Components/Atoms/Image';
import classNames from 'classnames';
import Text from '@/Components/Atoms/Text';
import { useDarkModeContext } from 'dark-mode-context';

export const BrandIcon = ({
  isDark,
  width = 64,
  height = 64
}: {
  isDark?: boolean;
  width?: number;
  height?: number;
}) => (
  <Image
    src={!isDark ? '/favicon-brand-dark.png' : '/favicon-brand.png'}
    alt="logo"
    width={width}
    height={height}
  />
);

const Brand = ({
  className,
  textClassName,
  ...rest
}: BaseComponent & { textClassName?: string }) => {
  const { isDarkMode } = useDarkModeContext();

  return (
    <div className={classNames('flex gap-1 items-center', className)} {...rest}>
      <BrandIcon isDark={isDarkMode} />
      <Text
        fontSize={25}
        color="text-brand dark:text-white"
        className={classNames('font-go3v2', textClassName)}
      >
        KATANA
      </Text>
    </div>
  );
};

export default Brand;
