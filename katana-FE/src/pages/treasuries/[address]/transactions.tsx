import Layout from '@/Components/Organisms/Layout';
import Transactions from '@/Components/Templates/TreasuryDetails/Transactions';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';

const TransactionsPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout>
      <Transactions />
    </Layout>
  );
};

export default TransactionsPage;
