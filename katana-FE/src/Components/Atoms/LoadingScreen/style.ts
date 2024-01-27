import styled from 'styled-components';
import { Spin } from 'antd';

export const SpinStyle = styled(Spin)`
  i.ant-spin-dot-item {
    background: ${({ theme }) => theme.colors.text};
  }
`;
