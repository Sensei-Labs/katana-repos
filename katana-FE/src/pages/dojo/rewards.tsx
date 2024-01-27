import Layout from '@/Components/Organisms/Layout';
import { RewardsDojo } from '@/Components/Templates/Dojo';
import { dojoAsideList } from '@/Components/Organisms/Aside/menu';

const Rewards = () => {
  return (
    <Layout list={dojoAsideList}>
      <RewardsDojo />
    </Layout>
  );
};

export default Rewards;
