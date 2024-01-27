import { setDimension } from '@/utils';
import styled from 'styled-components';

export const HeaderStyled = styled.h2<{
  $fontSize: string | number;
}>`
  font-size: ${({ $fontSize }) => setDimension($fontSize)};
  font-family: 'font-go3v2';
`;

export const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  .ant-form-item {
    width: 47%;
    input {
      text-align: center;
    }
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;
