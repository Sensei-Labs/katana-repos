import { Col, Empty, Row, Divider } from 'antd';
import useSWR from 'swr';

import Text from '@/Components/Atoms/Text/Text';
import Title from '@/Components/Atoms/Title';

import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';
import { BASE_DOJO_PATH } from '@/config';

interface QuestProps {
  id: number;
  active: boolean;
  deadline: string;
  completed: number;
  title: string;
  spRewards: number;
  details: string;
  tag?: string;
}

interface QuestsProps {
  data?: QuestProps[];
}

const calculateTimeLeft = (deadline: Date): string => {
  const currentTime: Date = new Date();
  const timeDifference: number = deadline.getTime() - currentTime.getTime();

  if (timeDifference <= 0) {
    return 'expired'; // Deadline has already passed
  }

  const hours: number = Math.floor(timeDifference / (1000 * 60 * 60));
  const days: number = Math.floor(hours / 24);
  const hoursLeft: number = hours % 24;

  return `${days} days, ${hoursLeft} hours left`;
};

const Quests = () => {
  const { data: questList, isLoading: userLoading } = useSWR<QuestsProps>(
    API_ROUTES.GET_QUESTS.path,
    fetcher
  );

  return (
    <div className="h-full rounded-3xl overflow-hidden px-8 py-4 mt-10">
      <div className="flex justify-start items-center gap-5 pb-10 ml-8">
        <Title
          fontSize={32}
          level="h1"
          fontFamily="font-mono"
          isBold
          withMargin={false}
        >
          Quests
        </Title>
      </div>
      <Row
        gutter={[20, 20]}
        className="gap-x-[10px] lg:gap-x-[40px] justify-center"
      >
        {!!questList?.data &&
          questList.data.map((quest, index) => {
            const deadline: Date = new Date(quest.deadline);
            const timeLeft: string = calculateTimeLeft(deadline);
            return (
              <Col
                xs={20}
                sm={18}
                md={11}
                lg={7}
                key={quest.id}
                className=" rounded-3xl p-[10px] flex flex-col justify-center items-center gap-1"
              >
                <Title
                  level="h3"
                  fontFamily="font-mono"
                  isBold
                  fontSize={28}
                  withMargin={false}
                  className="mb-6"
                >
                  {quest.title}
                </Title>
                <div className="flex justify-between items-center w-full">
                  <Text weight="bold" fontSize={16}>
                    Type:
                  </Text>
                  <div className="w-[110px]">
                    <Text
                      className={`w-[80px] text-white text-center ${
                        quest.tag == 'Discord'
                          ? 'bg-discord'
                          : quest.tag == 'Twitter'
                          ? 'bg-twitter'
                          : quest.tag == 'Creative'
                          ? 'bg-creative'
                          : 'bg-success2'
                      } rounded-xl py-[2px]`}
                    >
                      {quest.tag || 'No Tag'}
                    </Text>
                  </div>
                </div>
                <Divider className="mt-0 mb-2" />
                <div className="flex justify-between items-center w-full">
                  <Text weight="bold" fontSize={16}>
                    Reward:
                  </Text>
                  <Text className="w-[140px] text-center">
                    {quest.spRewards} Credits
                  </Text>
                </div>
                <Divider className="mt-0 mb-2" />
                <div className="flex justify-between items-center w-full">
                  <Text weight="bold" fontSize={16}>
                    Completions:
                  </Text>
                  <Text className="w-[140px] text-center">
                    {quest.completed || 0}
                  </Text>
                </div>
                <Divider className="mt-0 mb-2" />
                {timeLeft && (
                  <div className="flex justify-between items-center w-full">
                    <Text weight="bold" fontSize={16}>
                      Time Left:
                    </Text>
                    <Text
                      fontSize={16}
                      className="w-[140px] text-center "
                      weight="bold"
                    >
                      {timeLeft}
                    </Text>
                  </div>
                )}
                {timeLeft === 'expired' && <Text weight="bold">Expired</Text>}
                <Divider className="mt-0 mb-2" />
                {timeLeft && (
                  <a
                    href={`${BASE_DOJO_PATH}/quests/${quest.id}`}
                    className="bg-[#1e2e33] mt-2 py-1 rounded-3xl px-4"
                  >
                    <Text
                      fontSize={14}
                      weight="bold"
                      className="flex items-center justify-center gap-2 text-white"
                    >
                      Details
                    </Text>
                  </a>
                )}
              </Col>
            );
          })}
        {!questList?.data?.length && (
          <Empty className="m-auto" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Row>
    </div>
  );
};

export default Quests;
