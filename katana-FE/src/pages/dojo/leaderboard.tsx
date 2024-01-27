import { useMemo } from 'react';
import Link from 'next/link';
import { People } from 'react-iconly';
import { Card } from 'antd';
import useSWR from 'swr';

import Text from '@/Components/Atoms/Text/Text';
import Title from '@/Components/Atoms/Title';
import Layout from '@/Components/Organisms/Layout';
import Table from '@/Components/Molecules/Table/Table';

import { dojoAsideList } from '@/Components/Organisms/Aside/menu';

import { UserInfo } from '@/Contexts/Scope/types';
import { BASE_DOJO_PATH } from '@/config';
import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank'
  },
  {
    title: 'Username',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: 'Credit',
    dataIndex: 'socialCredits',
    key: 'socialCredits'
  },
  {
    title: 'Prestige',
    dataIndex: 'userPrestige',
    key: 'userPrestige'
  },
  {
    title: 'Level',
    dataIndex: 'userLevel',
    key: 'userLevel'
  }
];

const Leaderboard = () => {
  const { data: userList, isLoading: listLoading } = useSWR<UserInfo[]>(
    API_ROUTES.PLURAL_USERS.path,
    fetcher
  );

  const sortedUserList = useMemo(() => {
    if (!userList) return undefined;
    return [...userList].sort((a, b) => b.socialPoints - a.socialPoints);
  }, [userList]);

  const transformedUserList = useMemo(() => {
    return sortedUserList?.map((user, index) => {
      let userLevel = Math.floor(user.socialPoints / 100);
      let userPrestige = 0;
      const socialCredits = user.socialPoints || 0;
      const rank = index + 1;
      const nickname = user.nickName || 'Anonymous';

      if (user.socialPoints >= 5000 && user.socialPoints < 10000) {
        userLevel = 50;
        userPrestige = Math.floor((user.socialPoints - 5000) / 1000);
      } else if (user.socialPoints >= 10000) {
        userLevel = 50;
        userPrestige = 10;
      }

      return {
        ...user,
        rank,
        userLevel,
        userPrestige,
        socialCredits,
        nickname
      };
    });
  }, [sortedUserList]);

  return (
    <Layout list={dojoAsideList}>
      <Card className="h-full rounded-3xl overflow-hidden px-8 mt-10">
        <div className="flex justify-start items-center gap-5 ">
          <People set="bold" />
          <Title fontSize={20} fontFamily="font-mono" isBold withMargin={false}>
            Leaderboard
          </Title>
        </div>
      </Card>
      <Card className="h-full rounded-3xl overflow-hidden px-8 mt-10">
        {!!sortedUserList && (
          <Table
            variant="space"
            columns={columns}
            dataSource={transformedUserList}
          />
        )}
        {!sortedUserList && (
          <Text fontSize={20} weight="bold">
            No Users Yet
          </Text>
        )}
      </Card>
    </Layout>
  );
};

export default Leaderboard;
