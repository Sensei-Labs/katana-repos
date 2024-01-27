import Layout from '@/Components/Organisms/Layout';
import Settings from '@/Components/Templates/TreasuryDetails/Settings';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';

const SettingsPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_WRITE);

  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
