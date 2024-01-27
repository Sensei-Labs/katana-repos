import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { TitleStyle } from './style';

type TransformType = 'uppercase' | 'none' | 'capitalize' | 'lowercase';
export type FontFamily =
  | 'font-go3v2'
  | 'font-sans'
  | 'font-serif'
  | 'font-mono';

interface TitleProps {
  children?: ReactNode;
  transform?: TransformType;
  withMargin?: boolean;
  isBold?: boolean;
  isExtraBold?: boolean;
  isBlack?: boolean;
  fontSize?: string | number;
  lineHeight?: string | number;
  className?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  fontFamily?: FontFamily;
}

const Title: FC<TitleProps> = ({
  children,
  className,
  isExtraBold,
  isBlack,
  level = 'h2',
  fontSize = '1.5rem',
  lineHeight = '2rem',
  fontFamily = 'font-go3v2',
  isBold = fontFamily === 'font-sans',
  transform = 'none',
  withMargin = true
}) => {
  return (
    <TitleStyle
      as={level}
      $fontSize={fontSize}
      $lineHeight={lineHeight}
      className={classNames([
        `is-${transform}`,
        fontFamily,
        {
          'font-bold': isBold,
          'font-extrabold': isExtraBold,
          'font-black': isBlack,
          'mb-3': withMargin,
          'mb-0': !withMargin
        },
        className
      ])}
    >
      {children}
    </TitleStyle>
  );
};

export default Title;
