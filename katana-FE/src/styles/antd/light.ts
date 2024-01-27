import { theme as themeAntd, ThemeConfig } from 'antd';

const { compactAlgorithm } = themeAntd;

export const lightAntdThemeToken: ThemeConfig = {
  algorithm: [compactAlgorithm],
  components: {
    // Card: {
    //   colorBgContainer: '#326271'
    // },
    // Table: {
    //   colorBgContainer: '#326271'
    // },
    // Tag: {
    //   // blue
    //   blue1: '#0072F5', // bg color
    //   blue3: '#0072F5', // border color
    //   blue7: '#ffffff', // text color
    //   // purple
    //   purple1: '#EADCF8', // bg color
    //   purple3: '#9e81bd', // border color
    //   purple7: '#7828C8', // text color
    //   // green
    //   green1: '#DAFBE8', // bg color
    //   green3: '#459669', // border color
    //   green7: '#13A452' // text color
    // },
    // Tabs: {
    //   colorPrimary: '#f1f1f1',
    //   colorPrimaryHover: '#d1d1d1'
    // },
    // Tooltip: {
    //   colorBgDefault: '#1f1f1f'
    // },
    // Button: {
    //   colorPrimaryHover: '#326271'
    // },
    // Modal: {
    //   colorBgElevated: '#336271'
    // },
    // Input: {
    //   colorBgContainer: '#51808F',
    //   colorBgContainerDisabled: '#5f93a4',
    //   colorPrimaryHover: '#ffffff'
    // },
    // InputNumber: {
    //   colorBgContainer: '#51808F',
    //   colorBgContainerDisabled: '#5f93a4',
    //   colorPrimaryHover: '#7FB7C9'
    // },
    // Select: {
    //   colorBgContainer: '#51808F',
    //   colorBgContainerDisabled: '#5f93a4',
    //   colorPrimaryHover: '#7FB7C9',
    //   controlItemBgActive: '#51808F'
    // },
    // Spin: {
    //   colorPrimary: '#ffffff'
    // },
    Segmented: {
      borderRadius: 20,
      borderRadiusSM: 20
    }
  },
  token: {
    fontSize: 14,
    controlHeight: 40
    // colorBgBase: '#567b86',
    // colorLink: '#599bf8',
    // colorLinkHover: '#3b8cfd',
    // colorText: 'var(--colors-text)'
  }
};
