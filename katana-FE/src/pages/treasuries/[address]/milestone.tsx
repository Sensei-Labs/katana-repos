import Layout from '@/Components/Organisms/Layout';
import MilliStoneTemplate from '@/Components/Templates/TreasuryDetails/Milestones';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';

const MilliStonePage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout>
      <MilliStoneTemplate />
    </Layout>
  );
};

export default MilliStonePage;
