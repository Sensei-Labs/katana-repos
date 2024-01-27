import Layout from '@/Components/Organisms/Layout';
import { Dashboard } from '@/Components/Templates/TreasuryDetails';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';

const TreasuryPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default TreasuryPage;
