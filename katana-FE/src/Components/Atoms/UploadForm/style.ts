import styled from 'styled-components';
import { Upload } from 'antd';

export const UploadStyle = styled(Upload)<{ $width: string; $height?: string }>`
  width: ${({ $width }) => $width};

  .ant-upload.ant-upload-select {
    margin-bottom: 0 !important;
    margin-inline-end: 0 !important;
    width: ${({ $width }) => $width} !important;
    height: ${({ $height, $width }) => $height || $width} !important;
  }
`;
