import { Steps } from 'antd';
import styled, { css } from 'styled-components';

const cssActiveBefore = css`
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 5px;
  width: 3px;
  border-radius: 3px;
  height: 50px;
  background: ${({ theme }) => theme.colors.secondary};
`;

export const ContentStyle = styled.div<{ $isActive?: boolean }>`
  position: relative;
  cursor: pointer;
  max-width: 250px;
  margin-left: 20px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: -10px;
    width: 20px;
    height: 19px;
    background-color: inherit;
    transform: rotate(-45deg);
  }

  &:before {
    display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
    ${cssActiveBefore}
  }
`;

export const TimeLineStyle = styled(Steps)`
  .ant-steps-item {
    .ant-steps-item-tail {
      z-index: -1;
      padding: 0 !important;
      width: 10px !important;
      inset-inline-start: 15px !important;

      &:after {
        width: inherit !important;
      }
    }

    .ant-steps-item-icon {
      background-color: ${({ theme }) => theme.colors.timelineLineDisabled};
    }
  }

  .ant-steps-item.ant-steps-item-finish.ant-steps-item-active,
  .ant-steps-item.ant-steps-item-finish {
    .ant-steps-item-icon {
      border-top: 0;
      background-color: ${({ theme }) =>
        theme.colors.timelineBackground} !important;
      border-color: ${({ theme }) => theme.colors.navBorder} !important;

      .ant-steps-icon {
        color: white;
        font-weight: bold;
      }
    }

    .ant-steps-item-tail {
      padding: 0 !important;
      width: 10px !important;
      inset-inline-start: 15px !important;

      &:after {
        background-color: ${({ theme }) =>
          theme.colors.timelineBackground} !important;
        width: inherit !important;
      }
    }
  }

  .ant-timeline-item-head {
    padding: 0;
    border-radius: 100px;
  }

  .ant-timeline-item.ant-timeline-item-left {
    .ant-timeline-item-content {
      inset-inline-start: calc(50% + 10px);
    }
  }

  .ant-timeline-item.ant-timeline-item-right {
    .ant-timeline-item-content {
      width: calc(50% - 35px);

      ${ContentStyle} {
        margin-left: auto;
      }
    }
  }

  .ant-steps-item.ant-steps-item-finish {
    ${ContentStyle} {
      background-color: ${({ theme }) => theme.colors.timelineBackground};
    }
  }

  .ant-steps-item.ant-steps-item-wait {
    ${ContentStyle} {
      background-color: ${({ theme }) =>
        theme.colors.timelineBackgroundDisabled};
    }
  }
`;
