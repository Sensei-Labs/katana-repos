import { PropsWithChildren, useEffect } from 'react';

import { Header } from '@/Components/Organisms/Header';
import LayoutContainer from '@/Components/Organisms/LayoutContainer';
import { useRedirectAuthAccess } from '@/hooks/useRedirectAuthAccess';
import { BottomNavigation } from '@/Components/Organisms/BottomNavigation';
import { ListProps } from '@/Components/Organisms/Aside/Aside';
import { useScope } from '@/Contexts/Scope';
import LoadingScreen from '@/Components/Atoms/LoadingScreen';

type LayoutProps = {
  hasAside?: boolean;
  withContainer?: boolean;
  size?: 'default' | 'small';
  list?: ListProps[];
};

const Layout = ({
  children,
  hasAside = true,
  withContainer = true,
  list,
  size = 'default'
}: PropsWithChildren<LayoutProps>) => {
  // verify is authenticated
  useRedirectAuthAccess();

  const { discordUserInfo, onLogin, user, loading } = useScope();

  useEffect(() => {
    if (!user && discordUserInfo) {
      onLogin(discordUserInfo).then();
    }
  }, [discordUserInfo, onLogin, user]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <Header hasAside={hasAside} />
      <LayoutContainer
        size={size}
        withContainer={withContainer}
        hasAside={hasAside}
        list={list}
      >
        {children}
      </LayoutContainer>

      {/* mobile navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
