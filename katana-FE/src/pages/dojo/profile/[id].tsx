import { useRouter } from 'next/router';
import { Card, Col, Row } from 'antd';
import useSWR from 'swr';

import { dojoAsideList } from '@/Components/Organisms/Aside/menu';
import ProfileDetails from '@/Components/Molecules/ProfileDetails/ProfileDetails';
import Layout from '@/Components/Organisms/Layout';
import Text from '@/Components/Atoms/Text/Text';
import {
  AvatarAStyle,
  SkeletonAvatarStyle
} from '@/Components/Atoms/Banner/style';

import { fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { UserInfo } from '@/Contexts/Scope/types';

const User = () => {
  const router = useRouter();

  const { data: user, isLoading: userLoading } = useSWR<UserInfo>(
    `${API_ROUTES.PLURAL_USERS.path}/${router.query.id}`,
    fetcher
  );

  return (
    <Layout list={dojoAsideList}>
      {user ? (
        <div className=" h-full w-full flex flex-col gap-10 justify-center items-center">
          <div>
            {user?.avatar && <AvatarAStyle size={125} src={user.avatar} />}
            {!user?.avatar && <SkeletonAvatarStyle active size={125} />}
          </div>
          <div className="w-full">
            <Row gutter={[20, 20]} className="mb-8 justify-center">
              <Col xs={20} lg={16} xl={10}>
                <ProfileDetails user={user} editable={false} />
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <Card className=" h-full w-full flex flex-col gap-10 justify-center items-center">
          <Text>Cant find the user</Text>
        </Card>
      )}
    </Layout>
  );
};

export default User;
