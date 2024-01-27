import dynamic from 'next/dynamic';
import { Button, Drawer, Dropdown, Empty, List, Skeleton } from 'antd';
import { cloneElement, PropsWithChildren, ReactElement } from 'react';

import Title from '@/Components/Atoms/Title';
import { useNotification } from '@/Contexts/Notifications';
import { onReadNotification } from '@/fetches/notifications';
import NotificationItem from '@/Components/Organisms/NotificationPanel/NotificationItem';
import { MenuHeaderStyle, MenuStyle } from './style';
import useToggle from '@/hooks/useToggle';

const BadgeDot = dynamic(() => import('./BadgeDot'), { ssr: false });

type NotificationPanelProps = {
  wrapperChildrenProps?: BaseComponent;
};

const NotificationPanel = ({
  children,
  wrapperChildrenProps
}: PropsWithChildren<NotificationPanelProps>) => {
  const [openDrawer, toggleOpen] = useToggle();
  const { notifications, newsCount, isLoading, onRefresh, onAllRead } =
    useNotification();

  const onReadStateNotification = async ({ key }: any) => {
    await onReadNotification(key);
    return onRefresh();
  };

  const showDot = !newsCount && !isLoading;
  const countBadge = newsCount || undefined;

  return (
    <>
      <BadgeDot
        showDot={showDot}
        countBadge={countBadge}
        {...wrapperChildrenProps}
      >
        <div className="" onClick={toggleOpen}>
          {children}
        </div>
      </BadgeDot>
      <Drawer
        title={
          <MenuHeaderStyle>
            <Title withMargin={false}>Notifications</Title>
            <Button type="link" onClick={onAllRead} loading={isLoading}>
              Mark all as read
            </Button>
          </MenuHeaderStyle>
        }
        open={openDrawer}
        onClose={toggleOpen}
      >
        <MenuStyle className="bg-notificationPanel p-3 rounded-2xl">
          {isLoading ? (
            <Skeleton active />
          ) : !notifications?.length ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              dataSource={notifications}
              renderItem={(item) => {
                return <NotificationItem key={item.id} {...item} />;
              }}
            />
          )}
        </MenuStyle>
      </Drawer>
    </>
  );
};

export default NotificationPanel;
