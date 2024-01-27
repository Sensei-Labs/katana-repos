import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { Drawer, Layout, Space } from 'antd';
import { MenuOutlined, TwitterOutlined } from '@ant-design/icons';

import { ROUTES } from '@/config';
import useToggle from '@/hooks/useToggle';
import Brand from '@/Components/Atoms/Brand';
import Button from '@/Components/Atoms/Button';
import Discord from '@/Components/Atoms/Icons/Discord';

import { NavPublicStyle } from './style';

export const PublicHeader = () => {
  const [openDrawer, toggleDrawer] = useToggle(false);

  const menuItems = [
    {
      render: () => (
        <a
          key="buy-sensei"
          target="_blank"
          className="flex"
          rel="noopener noreferrer"
          href={ROUTES.MAGIC_EDEN_SENSEI_LABS.path}
        >
          <Button
            variant="solid"
            className="text-xl px-2 leading-[0]"
            bgColor="bg-transparent"
          >
            Buy a Sensei
          </Button>
        </a>
      )
    },
    {
      render: (completed?: boolean) => (
        <a
          key="discord"
          target="_blank"
          className="flex"
          rel="noopener noreferrer"
          href={ROUTES.DISCORD.path}
        >
          <Button
            variant="solid"
            className="text-xl px-2 leading-[0]"
            bgColor="bg-semi-transparent"
            icon={<Discord />}
          >
            {completed ? 'Join Discord' : ''}
          </Button>
        </a>
      )
    },
    {
      render: (completed?: boolean) => (
        <a
          key="twitter"
          target="_blank"
          className="flex"
          rel="noopener noreferrer"
          href={ROUTES.TWITTER.path}
        >
          <Button
            variant="solid"
            className="text-xl px-2 leading-[0]"
            bgColor="bg-semi-transparent"
            icon={<TwitterOutlined />}
          >
            {completed ? 'Follow in Twitter' : ''}
          </Button>
        </a>
      )
    }
  ];

  return (
    <Layout
      className={classNames(['sticky top-0 z-50 w-screen bg-transparent'])}
    >
      <NavPublicStyle
        role="navigation"
        $hasAside={false}
        className={classNames(['flex justify-between items-center'])}
      >
        <div className="w-40">
          <Link href="/">
            <Brand />
          </Link>
        </div>

        {/* Mobile Menu */}
        <Button
          variant="semi-trans"
          onClick={toggleDrawer}
          icon={<MenuOutlined />}
          className={classNames('block md:hidden', openDrawer && 'is-active')}
        />

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

          <Space className="w-full" direction="vertical" align="center">
            {menuItems.map(({ render }) => render(true))}
          </Space>
        </Drawer>

        {/* Desktop menu */}
        <div className="hidden items-center gap-2 md:flex">
          {menuItems.map(({ render }) => render())}
        </div>
      </NavPublicStyle>
    </Layout>
  );
};
