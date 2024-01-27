import { Select } from 'antd';
import styled from 'styled-components';

export const SelectAntdStyle = styled(Select)`
  &.fullHeight {
    .ant-select-selector {
      height: 100% !important;
    }
    .ant-select-selection-placeholder,
    .ant-select-selection-item {
      display: flex;
      align-items: center;
    }
  }
`;
