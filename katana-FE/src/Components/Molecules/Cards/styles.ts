import { Image } from 'antd';
import styled from 'styled-components';

export const CardStyle = styled.div``;

export const ResponsiveImage = styled(Image)<{
  height: number;
  $isResponsive: boolean;
}>`
  height: ${({ height, $isResponsive }) => ($isResponsive ? 155 : height)}px;

  @media screen and (min-width: 500px) {
    height: ${({ height }) => height}px;
  }
`;

export const ResponsiveWrapperImage = styled.div`
  .ant-image-mask {
    border-radius: 1.5rem 1.5rem 0.75rem 0.75rem;
    @media screen and (min-width: 500px) {
    }
  }
`;
