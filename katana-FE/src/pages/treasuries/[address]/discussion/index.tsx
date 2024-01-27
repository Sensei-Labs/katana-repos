import Layout from '@/Components/Organisms/Layout';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';
import { DiscussionTemplate } from '@/Components/Templates/TreasuryDetails';

const DiscussionPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout size="small">
      <DiscussionTemplate />
    </Layout>
  );
};

export default DiscussionPage;
