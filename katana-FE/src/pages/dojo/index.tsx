import Title from '@/Components/Atoms/Title';
import { dojoAsideList } from '@/Components/Organisms/Aside/menu';
import Layout from '@/Components/Organisms/Layout';

const DojoPage = () => {
  return (
    <Layout list={dojoAsideList}>
      <Title>Dojo</Title>
    </Layout>
  );
};

export default DojoPage;
