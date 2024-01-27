import { useEffect } from 'react';

import { ROUTES } from '@/config';
import { ScopeAddType } from '@/Contexts/Scope/types';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { useScope } from '@/Contexts/Scope';

export enum ScopeType {
  IS_CREATOR = 'isCreator',
  CAN_BE_WRITE = 'canBeWrite',
  CAN_BE_READ = 'canBeRead'
}

export function getAccess(userScope: ScopeAddType, scope: ScopeType) {
  return userScope[scope];
}

export enum REDIRECT_TREASURY {
  NOT_FOUND = 'NOT_FOUND',
  DASHBOARD = 'DASHBOARD'
}

const redirectPaths = {
  [REDIRECT_TREASURY.DASHBOARD]: ROUTES.DASHBOARD.path,
  [REDIRECT_TREASURY.NOT_FOUND]: ROUTES.NOT_FOUND.path
};

export function useRedirectTreasuryAccess(
  scope: ScopeType,
  redirectTo: REDIRECT_TREASURY = REDIRECT_TREASURY.NOT_FOUND
) {
  const {
    loading: loadingTreasury,
    firstLoading,
    scopeTreasury
  } = useProjectOne();
  const { loading: loadingScope, initLoading } = useScope();

  useEffect(() => {
    if (
      !loadingTreasury &&
      !firstLoading &&
      !loadingScope &&
      !initLoading &&
      !getAccess(scopeTreasury, scope)
    ) {
      window.location.href = redirectPaths[redirectTo];
    }
  }, [
    firstLoading,
    loadingTreasury,
    scope,
    initLoading,
    loadingScope,
    scopeTreasury,
    redirectTo
  ]);
}
