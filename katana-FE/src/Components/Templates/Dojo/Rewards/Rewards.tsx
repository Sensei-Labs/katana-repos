import { useState, useEffect, useMemo } from 'react';
import { Card, Col, Empty, Row } from 'antd';
import { TicketStar } from 'react-iconly';
import useSWR from 'swr';

import Text from '@/Components/Atoms/Text/Text';
import Title from '@/Components/Atoms/Title/Title';

import { API_ROUTES } from '@/config/api';
import { api, fetcher } from '@/services/api';
import { useScope } from '@/Contexts/Scope';
import { UserInfo } from '@/Contexts/Scope/types';

interface RewardProps {
  title: string;
  details?: string;
  thumbnail?: string;
  socialPoints: number;
  users_permissions_users?: UserInfo[];
}

interface RewardsProps {
  data: RewardProps[];
}

const Rewards = () => {
  const { user } = useScope();

  const { data: rewards, isLoading: userLoading } = useSWR<RewardsProps>(
    API_ROUTES.GET_REWARDS.path,
    fetcher
  );

  const [claimedRewards, unclaimedRewards] = useMemo(() => {
    const claimedRewards = [];
    const unclaimedRewards = [];

    if (rewards?.data !== undefined && user) {
      if (!Array.isArray(rewards?.data)) {
        console.error("Rewards should be an array but it's not:", rewards);
      } else {
        for (const reward of rewards?.data) {
          const claimedByUser = reward?.users_permissions_users?.some(
            (u) => u.id === user.id
          );

          if (claimedByUser) {
            claimedRewards.push(reward);
          } else {
            unclaimedRewards.push(reward);
          }
        }
      }
    }

    return [claimedRewards, unclaimedRewards];
  }, [rewards, user]);

  return (
    <Card className="h-full rounded-3xl overflow-hidden px-8 py-4 mt-10">
      <div className="flex justify-start items-center gap-5 pb-10">
        <TicketStar set="bold" />
        <Title fontSize={20} fontFamily="font-mono" isBold withMargin={false}>
          Rewards
        </Title>
      </div>
      <div>
        <div>
          <Title fontSize={18} fontFamily="font-mono" isBold>
            ({unclaimedRewards?.length || 0}) Unclaimed Rewards
          </Title>
          <Row gutter={[20, 20]} className="mb-7">
            {unclaimedRewards &&
              unclaimedRewards?.map((reward, index) => (
                <Col key={index} xs={12} lg={8}>
                  <Title fontFamily="font-mono" isBold fontSize={18}>
                    {reward.title}({'NFT'})
                  </Title>
                  <Text fontSize={16} weight="bold">
                    {reward.details}
                  </Text>
                  <Text fontSize={16} weight="bold">
                    {reward.socialPoints} Points
                  </Text>
                </Col>
              ))}

            {!unclaimedRewards?.length && (
              <Empty className="m-auto" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Row>
        </div>
        <div>
          <Title fontSize={18} fontFamily="font-mono" isBold>
            ({claimedRewards?.length || 0}) Claimed Rewards
          </Title>
          <Row gutter={[20, 20]}>
            {claimedRewards &&
              claimedRewards?.map((reward, index) => (
                <Col key={index} xs={12} lg={8}>
                  <Title fontFamily="font-mono" isBold fontSize={18}>
                    {reward.title}({'NFT'})
                  </Title>
                  <Text fontSize={16} weight="bold">
                    {reward.details}
                  </Text>
                  <Text fontSize={16} weight="bold">
                    {reward.socialPoints} Points
                  </Text>
                  <Text fontSize={12} weight="bold">
                    claimed at: 0/0/0
                  </Text>
                </Col>
              ))}

            {!claimedRewards?.length && (
              <Empty className="m-auto" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Row>
        </div>
      </div>
    </Card>
  );
};

export default Rewards;
