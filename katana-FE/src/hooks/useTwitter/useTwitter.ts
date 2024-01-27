import useSWR from 'swr';
import useSWRInmutable from 'swr/immutable';
import { useMemo } from 'react';

import { fetcher } from '@/services/api';

export const useTwitter = () => {
  const { data: refreshData, isLoading: refreshLoading } =
    useSWRInmutable<TwitterRefreshToken>('/twitter/refresh-token', fetcher);

  const accessToken = useMemo(() => {
    if (refreshLoading) return undefined;
    return refreshData?.access_token;
  }, [refreshData?.access_token, refreshLoading]);

  const { data: userData, isLoading: userLoading } =
    useSWRInmutable<TwitterUser>(
      accessToken && `/twitter/get-user?access_token=${accessToken}`,
      fetcher
    );

  return {
    userData,
    accessToken
  };
};
