import styled, { css } from 'styled-components';
import { setDimension } from '@/utils';

export const TextStyle = styled.p<{
  $color?: string;
  $fontSize: string | number;
  $overflowLines?: number;
  $lineHeight: string | number;
}>`
  font-size: ${({ $fontSize }) => setDimension($fontSize)};
  line-height: ${({ $lineHeight }) => setDimension($lineHeight)};
  ${({ $color }) => $color && `color: ${$color}`};

  ${({ $overflowLines }) =>
    $overflowLines &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${$overflowLines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;
