import { Card } from 'antd';
import styled from 'styled-components';

export const CardStyle = styled(Card)`
  height: 120px;

  .ant-card-body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:before,
    &:after {
      display: none;
    }
  }
`;
