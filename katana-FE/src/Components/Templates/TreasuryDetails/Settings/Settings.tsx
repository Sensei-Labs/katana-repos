import { useEffect } from 'react';
import { Spin, Tabs } from 'antd';
import { useRouter } from 'next/router';

import { ROUTES } from '@/config';
import resolveUrl from '@/utils/resolveUrl';
import Title from '@/Components/Atoms/Title';
import { useProjectOne } from '@/Contexts/ProjectOne';
import CollectionSettings from '@/Components/Organisms/CollectionSettings';
import GeneralSettings from '@/Components/Organisms/GeneralSettings';
import { getAccess, ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import AdvanceSettings from '@/Components/Organisms/AdvanceSettings';

const Settings = () => {
  const router = useRouter();
  const { loading: loadingTreasury, scopeTreasury } = useProjectOne();

  const items = [
    {
      key: 'general',
      label: 'General',
      children: <GeneralSettings />
    },
    {
      key: 'collections',
      label: 'Collections',
      children: <CollectionSettings />
    }
  ];

  if (getAccess(scopeTreasury, ScopeType.IS_CREATOR)) {
    items.push({
      key: 'advanced',
      label: 'Advanced',
      children: <AdvanceSettings />
    });
  }

  const onChangeTab = (tab: string) => {
    return router.push(
      resolveUrl(
        ROUTES.SETTINGS.path,
        ROUTES.SETTINGS.params.address,
        router?.query?.address as string
      ) + `?tab=${tab}`
    );
  };

  useEffect(() => {
    if (!router?.query?.tab && router.query?.address) {
      router.replace(
        resolveUrl(
          ROUTES.SETTINGS.path,
          ROUTES.SETTINGS.params.address,
          router?.query?.address as string
        ) + `?tab=general`
      );
    }
  }, [router]);

  return (
    <div>
      <Title fontSize="2rem" level="h1">
        Settings
      </Title>

      {loadingTreasury ? (
        <Spin size="large" />
      ) : (
        <Tabs
          size="large"
          items={items}
          onChange={onChangeTab}
          defaultActiveKey={router?.query?.tab as string}
        />
      )}
    </div>
  );
};

export default Settings;
