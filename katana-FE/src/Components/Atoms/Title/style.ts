import styled from 'styled-components';
import { setDimension } from '@/utils';

export const TitleStyle = styled.h2<{
  $fontSize: string | number;
  $lineHeight: string | number;
}>`
  font-size: ${({ $fontSize }) => setDimension($fontSize)};
  line-height: ${({ $lineHeight }) => setDimension($lineHeight)};
`;
