import { useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Text from '@/Components/Atoms/Text/Text';
import Title from '@/Components/Atoms/Title/Title';
import { dojoAsideList } from '@/Components/Organisms/Aside/menu';
import Layout from '@/Components/Organisms/Layout/Layout';

import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';

interface QuestProps {
  id: number;
  active: boolean;
  deadline: Date;
  completions: number;
  title: string;
  spRewards: number;
  details: string;
}

interface QuestsProps {
  data: QuestProps;
}

function calculateTimeLeft(deadline: Date): number {
  const currentTime: Date = new Date();
  const timeDifference: number = deadline.getTime() - currentTime.getTime();

  if (timeDifference <= 0) {
    return 0;
  }

  const hours: number = Math.floor(timeDifference / (1000 * 60 * 60));

  return hours;
}

const Quest = () => {
  const router = useRouter();

  const { data: questList, isLoading: questLoading } = useSWR<QuestsProps>(
    `${API_ROUTES.GET_QUESTS.path}/${router.query.slug}`,
    fetcher
  );

  const timeLeft: number = useMemo(() => {
    if (!questList?.data.deadline) return 0;
    const deadline: Date = new Date(questList.data.deadline);
    return calculateTimeLeft(deadline);
  }, [questList?.data.deadline]);

  return (
    <Layout list={dojoAsideList}>
      {!!questList && (
        <div>
          <Title fontFamily="font-mono" isBold>
            {questList.data.title}
          </Title>
          <Title fontFamily="font-mono" isBold>
            Reward: {questList.data.spRewards}
          </Title>
          <Title>Hours Left: {timeLeft}</Title>
          <Text>Details: {questList.data.details}</Text>
        </div>
      )}
      {!questList && (
        <Title fontFamily="font-mono" isBold>
          {' '}
          Cant find what you are searching for
        </Title>
      )}
    </Layout>
  );
};

export default Quest;
