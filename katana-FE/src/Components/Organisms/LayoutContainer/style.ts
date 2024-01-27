import styled, { css } from 'styled-components';

export const WrapperStyle = styled.div``;

export const BodyStyle = styled.main``;

const cssContainerSmall = css`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

export const ContentStyle = styled.div<{ $size?: 'small' | 'default' }>`
  ${({ $size }) => $size === 'small' && cssContainerSmall}
`;
