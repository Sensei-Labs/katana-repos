import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: Inter, sans-serif;
  }

  body {
    overflow-x: hidden;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
  }

  button.ant-btn-primary {
    box-shadow: none;
  }

  .ant-image-preview-mask {
    backdrop-filter: saturate(150%) blur(10px);
  }

  .ant-spin .ant-spin-dot-item {
    background-color: currentColor;
  }

  .custom-edit-title {
    .ant-typography-edit {
      float: right;
    }
  }

  .ant-notification.ant-notification-topRight {
    top: 85px !important;
  }

  .ant-notification-notice {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.notificationBackground};

    .ant-notification-notice-message {
      margin-bottom: 0 !important;
    }

    .ant-notification-notice-message, .ant-notification-close-icon {
      color: ${({ theme }) => theme.colors.text};
    }

    .ant-notification-notice-description {
      color: ${({ theme }) => theme.colors.secondaryText2};
    }
  }
`;
