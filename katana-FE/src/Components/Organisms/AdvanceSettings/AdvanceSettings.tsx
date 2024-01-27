import { Divider } from 'antd';

import { useProjectOne } from '@/Contexts/ProjectOne';
import { getAccess, ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import TreasuryAddressSettings from '@/Components/Organisms/TreasuryAddressSettings';
import AccessCollectionSettings from '@/Components/Organisms/AccessCollectionSettings';

type AdvanceSettingsProps = {};

const AdvanceSettings = (props: AdvanceSettingsProps) => {
  const { scopeTreasury } = useProjectOne();

  const isCreator = getAccess(scopeTreasury, ScopeType.IS_CREATOR);

  if (!isCreator) return null;
  return (
    <>
      <AccessCollectionSettings />
      <Divider />
      <TreasuryAddressSettings />
    </>
  );
};

export default AdvanceSettings;
