import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { TextStyle } from './style';
import { GenerateFontColor } from '@/styles/theme';

type TransformType = 'uppercase' | 'none' | 'capitalize' | 'lowercase';

export interface TextProps extends BaseComponent {
  children?: ReactNode;
  transform?: TransformType;
  withMargin?: boolean;
  color?: GenerateFontColor;
  $color?: string;
  fontSize?: string | number;
  lineHeight?: string | number;
  overflowLines?: number;
  weight?: 'bold' | 'normal';
  as?: any;
}

const resolveWeights = {
  bold: 'font-bold',
  normal: 'font-normal'
};

const Text: FC<TextProps> = ({
  children,
  className,
  $color,
  overflowLines,
  color = 'text-text',
  fontSize = '14px',
  lineHeight = '1.2rem',
  transform = 'none',
  withMargin = false,
  weight = 'normal',
  ...rest
}) => {
  const classes = [
    'text',
    className,
    color,
    resolveWeights[weight],
    transform !== 'none' ? transform : false,
    withMargin ? 'mb-3' : 'mb-0'
  ];
  return (
    <TextStyle
      $overflowLines={overflowLines}
      $fontSize={fontSize}
      $color={$color}
      $lineHeight={lineHeight}
      className={classNames(classes)}
      {...rest}
    >
      {children}
    </TextStyle>
  );
};

export default Text;
