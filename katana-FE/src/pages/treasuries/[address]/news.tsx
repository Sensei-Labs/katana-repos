import Layout from '@/Components/Organisms/Layout';
import { NewsTemplate } from '@/Components/Templates/TreasuryDetails';
import {
  ScopeType,
  useRedirectTreasuryAccess
} from '@/hooks/useRedirectTreasuryAccess';

const NewsPage = () => {
  useRedirectTreasuryAccess(ScopeType.CAN_BE_READ);

  return (
    <Layout>
      <NewsTemplate />
    </Layout>
  );
};

export default NewsPage;
