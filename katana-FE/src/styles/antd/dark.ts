import { theme as themeAntd, ThemeConfig } from 'antd';

const { compactAlgorithm, darkAlgorithm } = themeAntd;

export const darkAntdThemeToken: ThemeConfig = {
  algorithm: [compactAlgorithm, darkAlgorithm],
  components: {
    Card: {
      colorBgContainer: '#222222'
    },
    Table: {
      colorBgContainer: '#222222'
    },
    Tag: {
      blue: '#111a2c'
    },
    Spin: {
      colorPrimary: '#ffffff'
    },
    Tooltip: {
      colorBgDefault: '#232323'
    },
    Segmented: {
      borderRadius: 20,
      borderRadiusSM: 20
    }
  },
  token: {
    fontSize: 14,
    controlHeight: 40,
    colorBgBase: '#222222',
    colorText: 'var(--colors-text)'
  }
};
