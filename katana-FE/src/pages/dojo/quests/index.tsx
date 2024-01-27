import { dojoAsideList } from '@/Components/Organisms/Aside/menu';
import Layout from '@/Components/Organisms/Layout';
import { DojoQuests } from '@/Components/Templates/Dojo';

const Quests = () => {
  return (
    <Layout list={dojoAsideList}>
      <DojoQuests />
    </Layout>
  );
};

export default Quests;
