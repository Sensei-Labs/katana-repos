import styled from 'styled-components';

export const ItemStyle = styled.span`
  position: relative;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  height: 40px;
  display: flex;
  align-items: center;

  &.is-open {
    padding-left: 1rem;
    padding-right: 1rem;

    svg {
      margin-right: 20px;
    }
  }
`;
