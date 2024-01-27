import { useCallback, useMemo, useState } from 'react';
import { Card, Form, message, Input, Divider } from 'antd';
import { Edit } from 'react-iconly';

import Button from '@/Components/Atoms/Button/Button';
import Text from '@/Components/Atoms/Text/Text';
import DiscordButton from '@/Components/Atoms/DiscordButton/DiscordButton';
import TwitterButton from '@/Components/Atoms/TwitterButton/TwitterButton';

import { updateUser } from '@/fetches/auth';
import { UserInfo } from '@/Contexts/Scope/types';

const { TextArea } = Input;

const tags = [
  'artist',
  'design',
  'product',
  'product design',
  'product design',
  'product design'
];

interface ProfileDetailsProps {
  editable?: boolean;
  user: UserInfo;
}

const calculateUserLevelAndPrestige = (user: UserInfo) => {
  let userLevel = 0;
  let userPrestige = 0;

  if (user?.socialPoints && user.socialPoints <= 5000) {
    userLevel = Math.floor(user.socialPoints / 100);
  } else if (
    user?.socialPoints &&
    user.socialPoints > 5000 &&
    user.socialPoints <= 10000
  ) {
    userLevel = 50;
    userPrestige = Math.floor((user.socialPoints - 5000) / 1000);
  } else if (user?.socialPoints && user.socialPoints > 10000) {
    userLevel = 50;
    userPrestige = 10;
  }

  return { userLevel, userPrestige };
};

const ProfileDetails = ({ user, editable = true }: ProfileDetailsProps) => {
  const [edittingDetails, setEdittingDetails] = useState<boolean>(false);
  const [edittingUsername, setEdittingUsername] = useState<boolean>(false);
  const [detailsValue, setDetailsValue] = useState<string | undefined>(
    user.details
  );
  const [usernameValue, setUsernameValue] = useState<string | undefined>(
    user.nickName
  );

  const { userLevel, userPrestige } = useMemo(
    () => calculateUserLevelAndPrestige(user),
    [user]
  );

  const onSubmitDetails = useCallback(
    async (values: any) => {
      if (!user) return;
      await updateUser(user.id, values);
      message.success('Account updated');
      setDetailsValue(values.details);
      setEdittingDetails(false);
    },
    [user]
  );

  const onSubmitUsername = useCallback(
    async (values: any) => {
      if (!user) return;
      await updateUser(user.id, values);
      message.success('Account updated');
      setUsernameValue(values.nickName);
      setEdittingUsername(false);
    },
    [user]
  );

  const cancelDetails = useCallback(() => {
    setEdittingDetails(false);
  }, []);

  const cancelUsername = useCallback(() => {
    setEdittingUsername(false);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-3 flex gap-1 items-center">
        {!edittingUsername && (
          <Text weight="bold" fontSize={'32px'} className="  text-center">
            {usernameValue || 'Anonymous'}
          </Text>
        )}
        {!!edittingUsername && (
          <Form onFinish={onSubmitUsername}>
            <Form.Item name="nickName" rules={[{ required: true }]}>
              <Input defaultValue={usernameValue} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="text"
                className="ml-4 bg-white text-black border-black"
                htmlType="button"
                onClick={cancelUsername}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
        <Text color="text-secondaryText2" className="">
          {user && editable && (
            <div
              className="cursor-pointer"
              onClick={() => setEdittingUsername(true)}
            >
              <Edit set="light" />
            </div>
          )}
        </Text>
      </div>
      <div className="flex mb-2 gap-4 items-center">
        {!edittingDetails && (
          <Text fontSize={'16px'} className="min-w-[120px]">
            {detailsValue || 'No description yet'}
          </Text>
        )}
        {!!edittingDetails && (
          <Form onFinish={onSubmitDetails}>
            <Form.Item name="details" rules={[{ required: true }]}>
              <TextArea rows={4} defaultValue={detailsValue} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="text"
                className="ml-4 bg-white text-black border-black"
                htmlType="button"
                onClick={cancelDetails}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
        <Text color="text-secondaryText2" className="flex items-center gap-7">
          {user && editable && (
            <div
              className="cursor-pointer"
              onClick={() => setEdittingDetails(true)}
            >
              <Edit set="light" />
            </div>
          )}
        </Text>
      </div>
      <div className="flex mt-2 mb-6">
        {!user.user_tags && (
          <div className="flex flex-wrap gap-4 w-full justify-center pl-0">
            {tags.slice(0, 4).map((tag) => (
              <div key={1} className="py-1 px-6 rounded-3xl bg-aside">
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
      <Card className="p-2 rounded-3xl truncate flex flex-col w-full  bg-aside">
        <div className=" flex justify-between">
          <Text color="text-secondaryText2" className="flex items-center gap-7">
            Discord:
          </Text>
          <div className="flex flex-col">
            {!!user?.discordToken ||
              (!editable && (
                <Text
                  weight="bold"
                  className="mt-2 flex items-center gap-2 w-[120px] text-center"
                  color=""
                >
                  @ {user.nickName || 'anonymous'}
                </Text>
              ))}
            {!user?.discordToken && editable && (
              <a className="w-[120px] text-center">
                <DiscordButton />
              </a>
            )}
          </div>
        </div>
        <Divider className="mt-2" />
        <div className="flex justify-between">
          <Text color="text-secondaryText2" className="flex items-center gap-7">
            Twitter:
          </Text>
          <div className="flex flex-col">
            {!!user?.twitterToken ||
              (!editable && (
                <Text
                  weight="bold"
                  className="mt-2 flex items-center gap-2 w-[120px] text-center"
                  color=""
                >
                  @ {user.nickName || 'anonymous'}
                </Text>
              ))}
            {!user?.twitterToken && editable && (
              <a className="w-[120px] text-center">
                <TwitterButton />
              </a>
            )}
          </div>
        </div>
        <Divider className="mt-2" />
        <div className="flex justify-between">
          <Text color="text-secondaryText2" className="flex items-center gap-7">
            Social Credits:
          </Text>
          <div className="flex flex-col w-[120px] text-center">
            <Text weight="bold" className="mt-2 text-center">
              {user?.socialPoints || 0}
            </Text>
          </div>
        </div>
        <Divider className="mt-1" />

        <div className="flex justify-between">
          <Text color="text-secondaryText2" className="flex items-center gap-7">
            Prestige:
          </Text>
          <div className="flex flex-col ">
            <Text weight="bold" className="mt-2 w-[120px] text-center">
              {userPrestige || 0}
            </Text>
          </div>
        </div>
        <Divider className="mt-1" />

        <div className="flex justify-between">
          <Text color="text-secondaryText2" className="flex items-center gap-7">
            Current Level:
          </Text>
          <div className="flex flex-col ">
            <Text weight="bold" className="mt-2 w-[120px] text-center">
              {userLevel || 0}
            </Text>
          </div>
        </div>
        <Divider className="mt-1" />
        <div className="flex justify-between">
          <Text color="text-secondaryText2" className="flex items-center gap-7">
            Sensei NFTs:
          </Text>
          <div className="w-[120px] text-center">
            {!!user?.user_tags && (
              <ul>
                {user.user_tags.map((tag, index) => (
                  <li key={index}>
                    <Text weight="bold">{tag?.value}</Text>
                  </li>
                ))}
              </ul>
            )}
            {!user.user_tags && <Text weight="bold">No Tags yet</Text>}
          </div>
        </div>

        <Divider className="mt-1" />
      </Card>
    </div>
  );
};

export default ProfileDetails;
