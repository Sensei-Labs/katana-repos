import styled from 'styled-components';
import type { ColorType } from '@/styles/theme';

export const TitleStyle = styled.div`
  div.text {
    width: fit-content;
    z-index: 2;
    margin-left: 10px;
    padding: 0 5px;
  }

  div.line {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    margin: auto;
    opacity: 0.3;
    background: ${({ theme }) => theme.colors.white};
  }
`;

export const WrapperStyle = styled.div<{ $color: ColorType }>`
  background: ${({ theme, $color }) => theme.colors[$color]};

  ${TitleStyle} {
    div.text {
      background: ${({ theme, $color }) => theme.colors[$color]};
    }
  }
`;
