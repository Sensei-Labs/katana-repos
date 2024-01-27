import { useEffect } from 'react';
import { ROUTES } from '@/config';
import { useScope } from '@/Contexts/Scope';

export function useWithAuthAccess() {
  const { loading, isAuthenticated, loadingDiscordAuth } = useScope();

  useEffect(() => {
    if (!loadingDiscordAuth && !loading && isAuthenticated) {
      window.location.href = ROUTES.TREASURIES.path;
    }
  }, [isAuthenticated, loading, loadingDiscordAuth]);
}
