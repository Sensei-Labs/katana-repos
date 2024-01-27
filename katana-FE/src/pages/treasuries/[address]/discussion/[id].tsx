import Layout from '@/Components/Organisms/Layout';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';
import { DiscussionDetailTemplate } from '@/Components/Templates/TreasuryDetails';

const TreasuryPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout size="small">
      <DiscussionDetailTemplate />
    </Layout>
  );
};

export default TreasuryPage;
