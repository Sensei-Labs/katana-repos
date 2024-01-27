import { PropsWithChildren, ReactNode, useMemo } from 'react';

import { useProjectOne } from '@/Contexts/ProjectOne';
import { getAccess, ScopeType } from '@/hooks/useRedirectTreasuryAccess';

type customPermission = () => boolean;

type PermissionSectionProps = {
  scope: (ScopeType | customPermission)[];
  fallback?: ReactNode;
};

const PermissionSection = ({
  scope,
  children,
  fallback = null
}: PropsWithChildren<PermissionSectionProps>) => {
  const { scopeTreasury } = useProjectOne();
  const permission = useMemo(() => {
    let havePermission = false;
    scope.forEach((_scope) => {
      const getPermission =
        typeof _scope === 'function'
          ? _scope()
          : getAccess(scopeTreasury, _scope);

      if (getPermission) havePermission = true;
    });

    return havePermission;
  }, [scopeTreasury, scope]);

  if (!permission) return <>{fallback}</>;
  return <>{children}</>;
};

export default PermissionSection;
