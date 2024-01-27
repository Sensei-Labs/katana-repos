import { useEffect } from 'react';
import { ROUTES } from '@/config';
import { useScope } from '@/Contexts/Scope';

export enum REDIRECT_APP {
  NOT_FOUND = 'NOT_FOUND',
  DASHBOARD = 'DASHBOARD',
  SELECT_WALLET = 'SELECT_WALLET'
}

const redirectPaths = {
  [REDIRECT_APP.DASHBOARD]: ROUTES.DASHBOARD.path,
  [REDIRECT_APP.NOT_FOUND]: ROUTES.NOT_FOUND.path,
  [REDIRECT_APP.SELECT_WALLET]: ROUTES.LOGIN.path
};

export function useRedirectAuthAccess(
  redirectTo: REDIRECT_APP = REDIRECT_APP.SELECT_WALLET
) {
  const { loading, isAuthenticated, loadingDiscordAuth, initLoading } =
    useScope();

  useEffect(() => {
    if (!loadingDiscordAuth && !loading && !initLoading && !isAuthenticated) {
      window.location.href = redirectPaths[redirectTo];
    }
  }, [isAuthenticated, initLoading, loading, loadingDiscordAuth, redirectTo]);
}
