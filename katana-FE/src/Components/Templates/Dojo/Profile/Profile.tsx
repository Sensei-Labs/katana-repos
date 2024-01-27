import { useRouter } from 'next/router';
import { Col, Row, Card } from 'antd';

import Title from '@/Components/Atoms/Title';
import Text from '@/Components/Atoms/Text/Text';
import ProfileApps from '@/Components/Molecules/ProfileApps/ProfileApps';
import ProfileDetails from '@/Components/Molecules/ProfileDetails/ProfileDetails';
import {
  AvatarAStyle,
  SkeletonAvatarStyle,
  SkeletonStyle
} from '@/Components/Atoms/Banner/style';

import { useScope } from '@/Contexts/Scope';

const tags = [
  'Designer',
  'Frontend Developer',
  'Community Member',
  'Collector, Alpha'
];

const Profile = () => {
  const { userCommunity: user } = useScope();

  return (
    <div className="h-full w-full flex flex-col gap-10 justify-center items-center">
      <div>
        {user?.avatar && <AvatarAStyle size={125} src={user.avatar} />}
        {!user?.avatar && <SkeletonAvatarStyle active size={125} />}
      </div>
      {user && (
        <div className="w-full">
          <Row gutter={[20, 20]} className="mb-8 justify-center">
            <Col xs={20} lg={16} xl={10}>
              <ProfileDetails user={user} />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Profile;
