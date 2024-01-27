import styled from 'styled-components';
import { Card, Layout, Menu } from 'antd';
import { mediaQueries } from '@/styles/theme';

export const NavPublicStyle = styled(Layout.Header)<{ $hasAside: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  backdrop-filter: saturate(180%) blur(10px) !important;
  box-shadow: rgb(2 1 1 / 10%) 0 5px 20px -5px !important;
  background: rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid transparent;

  &.ant-layout-header {
    height: 65px;
    padding-inline: 15px;

    ${mediaQueries.desktop} {
      padding-inline: 56.25px;
    }
  }

  .active-navLink {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const NavStyle = styled(Layout.Header)<{ $hasAside: boolean }>`
  --text-color: ${({ theme }) => theme.colors.navActive};
  border-bottom: 1px solid ${({ theme }) => theme.colors.navBorder};

  &.ant-layout-header {
    height: 65px;
    padding-inline: 15px;
    background: ${({ theme }) => theme.colors.nav} !important;

    ${mediaQueries.desktop} {
      padding-inline: 56.25px;
    }
  }

  .active-navLink {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const StyleMenu = styled(Menu)`
  &.ant-menu-horizontal {
    border-bottom: none;
    gap: 3px;
    background-color: transparent;

    li.ant-menu-item {
      display: flex;
      min-width: 6.5rem;
      position: relative;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      padding: 8px 0;

      .ant-menu-title-content {
        flex: 1;
        border-radius: 12px;
        padding: 10px 0;
        margin-bottom: 3px;

        svg {
          width: 1em;
          height: 1em;
        }
      }
    }

    li.ant-menu-item-selected {
      background: transparent;
      color: var(--text-color);

      &:after {
        border-color: var(--text-color);
      }

      .ant-menu-title-content {
        background: rgba(255, 255, 255, 0.1);
      }

      &.ant-menu-item-active:after {
        border-color: var(--text-color) !important;
      }
    }

    li.ant-menu-item.ant-menu-item-active {
      &:after {
        border-color: transparent;
      }

      .ant-menu-title-content {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
`;

export const CardPriceStyle = styled(Card)`
  &.ant-card {
    background: ${({ theme }) => theme.colors['dark-transparent-02']};
  }
  .ant-card-body {
    padding: 5px 10px;

    ${mediaQueries.tablet} {
      padding: 7px 15px;
    }
  }
`;
