import Layout from '@/Components/Organisms/Layout';
import { NFTTemplate } from '@/Components/Templates/TreasuryDetails';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';

const TreasuryPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout>
      <NFTTemplate />
    </Layout>
  );
};

export default TreasuryPage;
