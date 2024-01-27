import styled from 'styled-components';

export const AsideStyle = styled.aside`
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors['semi-transparent']};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors['border-semi-transparent']};
  }
`;
