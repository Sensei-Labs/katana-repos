import 'antd/dist/reset.css';
import '@/styles/global.scss';
import '@solana/wallet-adapter-react-ui/styles.css';
import { StyleProvider } from '@ant-design/cssinjs';
import { Inter } from 'next/font/google';

import Head from 'next/head';
import { ROUTES } from '@/config';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { DarkModeProvider, useDarkModeContext } from 'dark-mode-context';

import { WalletContext } from '@/Contexts/WalletContext/WalletContext';
import { ScopeProvider } from '@/Contexts/Scope/Scope';

import { GlobalStyle } from '@/styles/global';
import { resolveContext } from '@/Contexts';
import { LightTheme, DarkTheme } from '@/styles/theme';
import { NotificationProvider } from '@/Contexts/Notifications';
import { AssetPriceProvider } from '@/Contexts/AssetPrice';
import { darkAntdThemeToken } from '@/styles/antd/dark';
import { lightAntdThemeToken } from '@/styles/antd/light';

const nunito = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

function RenderMyApp({ children }: PropsWithChildren) {
  const { isDarkMode } = useDarkModeContext();
  const { pathname } = useRouter();

  const findRouter = useMemo(() => {
    let output = null;
    for (let item in ROUTES) {
      const value = ROUTES[item as keyof typeof ROUTES];
      if (value.path === pathname) {
        output = value;
        break;
      }
    }
    return output;
  }, [pathname]);

  const CustomProvider = useCallback(
    ({ children }: PropsWithChildren) => {
      if (findRouter?.context) {
        const Component = resolveContext[findRouter?.context];
        if (!Component) {
          throw new Error(
            `Context not exist in resolveContext with key: ${findRouter?.context}`
          );
        }
        return <Component>{children}</Component>;
      }
      return <>{children}</>;
    },
    [findRouter?.context]
  );

  return (
    <ThemeProvider theme={isDarkMode ? DarkTheme : LightTheme}>
      <ConfigProvider
        theme={isDarkMode ? darkAntdThemeToken : lightAntdThemeToken}
      >
        <GlobalStyle />
        <ScopeProvider>
          <NotificationProvider>
            <AssetPriceProvider>
              <CustomProvider>{children}</CustomProvider>
            </AssetPriceProvider>
          </NotificationProvider>
        </ScopeProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${nunito.variable} font-sans`}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <title>Katana</title>
      </Head>
      <DarkModeProvider>
        <WalletContext>
          <RenderMyApp>
            <StyleProvider>
              <Component {...pageProps} />
            </StyleProvider>
          </RenderMyApp>
        </WalletContext>
      </DarkModeProvider>
    </main>
  );
}

export default MyApp;
