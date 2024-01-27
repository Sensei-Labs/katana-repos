import styled from 'styled-components';

export const WysiwygStyle = styled.div`
  * {
    font-size: 1rem;
  }

  p,
  li {
    color: ${({ theme }) => theme.colors.secondaryText2};
  }
`;
