import { Menu } from 'antd';
import styled, { css } from 'styled-components';

const cssItemStyle = css<{ $minWidth?: string }>`
  li.ant-menu-item {
    display: flex;
    min-width: ${({ $minWidth = '6.5rem' }) => $minWidth};
    position: relative;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    padding: 8px 0;
    height: 80px;
    margin-bottom: 0;
    margin-top: 0;

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
`;

export const StyleMenu = styled(Menu)<{ $minWidth?: string }>`
  &.ant-menu-inline {
    gap: 3px;
    width: 100%;
    overflow-x: auto;
    justify-content: flex-start;
    scroll-snap-type: x mandatory;
    flex-flow: row nowrap;

    ${cssItemStyle}
  }

  &.ant-menu-horizontal {
    gap: 3px;
    border-bottom: none;
    background-color: transparent;

    ${cssItemStyle}
  }
`;
