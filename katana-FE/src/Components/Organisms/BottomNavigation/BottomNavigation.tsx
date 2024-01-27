import Link from 'next/link';
import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Tooltip from '@/Components/Atoms/Tooltip';
import { BASE_PATH_PROJECT_DETAILS } from '@/config';
import menuBottom from '@/Components/Organisms/Aside/menu';

import { StyleMenu } from './style';
import { itemsPrimaryNavbar } from '@/Components/Organisms/Header';

export const BottomNavigation = () => {
  const { pathname, query } = useRouter();
  const [activeInternalNavigation, _, { onHidden, onVisible }] = useToggle();

  const activePath = useMemo(() => {
    const [hrefWithoutQueryParams] = pathname.split('?');
    const [hrefWithoutHash] = hrefWithoutQueryParams.split('#');
    return hrefWithoutHash;
  }, [pathname]);

  const prepareHref = (href: string) => {
    if (href.includes('[address]')) {
      if (!query?.address) return '';
      return href.replace('[address]', (query?.address as string) || '');
    }
    return href;
  };

  useEffect(() => {
    if (activePath?.includes(BASE_PATH_PROJECT_DETAILS)) {
      // active treasury details navigation
      onVisible();
    } else {
      // default navigation
      onHidden();
    }
  }, [activePath, onHidden, onVisible]);

  return (
    <div className="fixed shadow-[0_2px_9px_0_rgba(0,0,0,0.3)] w-full bottom-0 left-0 bg-nav block z-50 md:hidden">
      {activeInternalNavigation ? (
        <StyleMenu
          mode="inline"
          inlineIndent={5}
          inlineCollapsed={false}
          selectedKeys={[activePath]}
          className={classNames([
            'flex-1 justify-center',
            'h-full bg-transparent',
            'flex'
          ])}
          items={menuBottom.map((item) => ({
            key: item.href,
            label: (
              <Tooltip text={item.title}>
                <div>
                  <Link
                    href={prepareHref(item.href)}
                    passHref
                    className={classNames([
                      'h-full w-full',
                      'flex justify-end items-center flex-col'
                    ])}
                  >
                    {item.icon}
                    <Text color="currentColor" fontSize={14}>
                      {item.title}
                    </Text>
                  </Link>
                </div>
              </Tooltip>
            )
          }))}
        />
      ) : (
        <StyleMenu
          items={itemsPrimaryNavbar}
          mode="horizontal"
          selectedKeys={[activePath]}
          className={classNames([
            'flex-1 justify-center',
            'h-full bg-transparent',
            'flex'
          ])}
        />
      )}
    </div>
  );
};
