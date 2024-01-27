import styled from 'styled-components';
import { setDimension } from '@/utils';

export const WrapperStyle = styled.div<{
  width: number | string;
  height: number | string;
}>`
  line-height: 0;
  width: ${({ width }) => setDimension(width)};
  height: ${({ height }) => setDimension(height)};

  img {
    width: 100%;
    height: 100%;
  }
`;
