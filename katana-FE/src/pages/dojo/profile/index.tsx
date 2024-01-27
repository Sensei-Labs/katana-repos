import Layout from '@/Components/Organisms/Layout';
import { DojoProfile } from '@/Components/Templates/Dojo';
import { dojoAsideList } from '@/Components/Organisms/Aside/menu';

const Profile = () => {
  return (
    <Layout list={dojoAsideList}>
      <DojoProfile />
    </Layout>
  );
};

export default Profile;
