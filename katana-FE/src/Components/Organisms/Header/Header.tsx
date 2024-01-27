import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { MenuOutlined } from '@ant-design/icons';
import { Badge, Drawer, Layout, MenuProps, Space, Switch, Tag } from 'antd';
import { useDarkModeContext } from 'dark-mode-context';
import { Discovery, Home, Notification, Wallet } from 'react-iconly';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { ROUTES } from '@/config';
import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Brand from '@/Components/Atoms/Brand';
import Button from '@/Components/Atoms/Button';
import Tooltip from '@/Components/Atoms/Tooltip';
import { formatMoney } from '@/utils/generalFormat';
import SolanaIcon from '@/Components/Atoms/Icons/Solana';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';
import NotificationPanel from '@/Components/Organisms/NotificationPanel';

import Avatar from './Avatar/Avatar';
import { CardPriceStyle, NavStyle, StyleMenu } from './style';

interface HeaderItems {
  key: string;
  label: string;
  icon: JSX.Element;
  path: string;
  disabled: boolean;
}

const baseItems: HeaderItems[] = [
  {
    key: ROUTES.TREASURIES.path,
    label: 'Treasuries',
    icon: <Home set="bold" />,
    path: ROUTES.TREASURIES.path,
    disabled: false
  },
  process.env.NODE_ENV === 'development' && {
    key: ROUTES.DOJO.path,
    label: 'Dojo',
    icon: <Discovery set="bold" />,
    path: ROUTES.DOJO.path,
    disabled: false
  },
  {
    key: ROUTES.LOANS.path,
    label: 'Loans',
    icon: <Wallet set="bold" />,
    path: ROUTES.LOANS.path,
    disabled: true
  }
].filter((item): item is HeaderItems => !!item);

export const itemsPrimaryNavbar: MenuProps['items'] = baseItems.map(
  ({ key, icon, label, path, disabled }) => ({
    key,
    label: disabled ? (
      <div className="text-secondaryText2 relative">
        <div
          className={classNames([
            'h-full w-full',
            'flex justify-end items-center flex-col'
          ])}
        >
          {icon}
          <Text color="text-secondaryText2" fontSize={14}>
            {label}
          </Text>
        </div>

        <Tag
          color="magenta"
          className="rounded-2xl absolute top-0 left-16 text-[0.55rem]"
        >
          COMING SOON!
        </Tag>
      </div>
    ) : (
      <Tooltip text={label}>
        <div>
          <Link
            href={path}
            passHref
            className={classNames([
              'h-full w-full',
              'flex justify-end items-center flex-col'
            ])}
          >
            {icon}
            <Text color="currentColor" fontSize={14}>
              {label}
            </Text>
          </Link>
        </div>
      </Tooltip>
    )
  })
);

export const getActivePathRef = (pathname: string) => {
  const [href1] = pathname.split('?');
  const [href2] = href1.split('#');

  const findPathItem = baseItems.find((item) => href2.includes(item.path));
  return findPathItem?.path || href2;
};

export const Header = ({ hasAside }: { hasAside: boolean }) => {
  const { pathname } = useRouter();
  const { enabled, getAsset } = useAssetPrice();
  const [openDrawer, toggleDrawer] = useToggle(false);
  const { isDarkMode, setDarkMode } = useDarkModeContext();

  const activePath = useMemo(() => {
    return getActivePathRef(pathname);
  }, [pathname]);

  const changeTheme = (checked: boolean) => {
    if (checked) {
      setDarkMode(true);
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
  };

  const asset = useMemo(() => {
    return getAsset(AssetAcceptedEnum.SOL);
  }, [getAsset]);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [setDarkMode]);

  return (
    <>
      <Layout
        className={classNames(['sticky top-0 z-50 w-screen bg-transparent'])}
      >
        <NavStyle
          role="navigation"
          $hasAside={hasAside}
          className={classNames(['flex justify-between items-center'])}
        >
          <Space>
            <Link href="/">
              <Brand
                textClassName="hidden sm:block"
                className="w-[50px] xs:w-[120px] sm:w-[150px]"
              />
            </Link>

            {enabled && (
              <CardPriceStyle className="ml-0 lg:ml-5" bordered={false}>
                <Space>
                  <IconWrapper>
                    <SolanaIcon />
                  </IconWrapper>

                  <Text className="mt-0.5" fontSize="16px">
                    ${formatMoney(asset?.price || 0)}
                    <span
                      className={classNames('ml-2 font-bold', {
                        'text-success2': (asset?.percent_change_24h || 0) > 0,
                        'text-error2': (asset?.percent_change_24h || 0) <= 0
                      })}
                    >
                      {formatMoney(asset?.percent_change_24h || 0)}%
                    </span>
                  </Text>
                </Space>
              </CardPriceStyle>
            )}
          </Space>

          <StyleMenu
            items={itemsPrimaryNavbar}
            mode="horizontal"
            selectedKeys={[activePath]}
            className={classNames([
              'flex-1 justify-center',
              'h-full bg-transparent',
              'hidden md:flex'
            ])}
          />

          <div className="hidden items-center gap-2 md:flex">
            <Switch
              checked={isDarkMode}
              checkedChildren="Dark"
              unCheckedChildren="Light"
              onChange={changeTheme}
            />
            <NotificationPanel>
              <Button
                variant="semi-trans"
                bgColor="bg-transparent"
                className="text-3xl w-[30px] justify-center leading-[0]"
                style={{ padding: 0 }}
                icon={<Notification set="bold" />}
              />
            </NotificationPanel>

            <Avatar />
          </div>

          {/* Mobile Menu */}
          <Space
            className={classNames('flex md:hidden', openDrawer && 'is-active')}
          >
            <NotificationPanel
              wrapperChildrenProps={{
                className: 'block mr-2 mt-3'
              }}
            >
              <Button
                variant="solid"
                style={{ padding: 0 }}
                bgColor="bg-transparent"
                icon={<Notification set="bold" />}
                className="text-[22px] md:text-3xl px-0 leading-[0]"
              />
            </NotificationPanel>

            <Button
              variant="semi-trans"
              onClick={toggleDrawer}
              icon={<MenuOutlined />}
            />
          </Space>

          <Drawer
            title="Katana Menu"
            open={openDrawer}
            placement="right"
            onClose={toggleDrawer}
          >
            <div className="mb-20">
              <Link href="/">
                <Brand className="justify-center" />
              </Link>
            </div>

            <div className="flex flex-col gap-5 justify-between items-center">
              <Switch
                checked={isDarkMode}
                checkedChildren="Dark"
                unCheckedChildren="Light"
                onChange={changeTheme}
              />
              <WalletMultiButton style={{ height: 40, marginLeft: 25 }} />
            </div>

            <Space
              className="w-full"
              direction="vertical"
              align="center"
            ></Space>
          </Drawer>
        </NavStyle>
      </Layout>
    </>
  );
};
