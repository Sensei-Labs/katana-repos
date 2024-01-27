import styled, { keyframes } from 'styled-components';

const rotateKeyframes = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingWrapper = styled.span`
  svg {
    animation: ${rotateKeyframes} 1s linear infinite;
  }
`;
