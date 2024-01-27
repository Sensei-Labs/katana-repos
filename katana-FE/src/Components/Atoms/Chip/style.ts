import styled from 'styled-components';

export type StatusBadge = 'success' | 'error' | 'warning';

export const BadgeStyle = styled.div<{ $type: StatusBadge }>`
  cursor: pointer;
  padding: 3px 7px;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 30px;
  transition: all 0.2s;
  color: white;
  text-align: center;
  background: ${({ theme, $type }) => theme.colors[`${$type}-transparent-06`]};

  &:hover {
    transform: scale(1.08);
  }
`;
