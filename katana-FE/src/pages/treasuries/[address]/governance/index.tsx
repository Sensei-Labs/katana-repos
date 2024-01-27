import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Card, Divider, Select, Empty, Spin } from 'antd';

import Title from '@/Components/Atoms/Title';
import Text from '@/Components/Atoms/Text';
import Button from '@/Components/Atoms/Button';
import SearchInput from '@/Components/Atoms/SearchInput';
import Timer from '@/Components/Organisms/Timer';
import Layout from '@/Components/Organisms/Layout';

import { getProposalSearchPath, getProposalsPaths } from '@/config/api';
import { fetcher } from '@/services/api';
import RightArrowIcon from '@/Components/Atoms/Icons/RightArrow';
import Link from 'next/link';
import { ROUTES } from '@/config';
import { useRouter } from 'next/router';
import { useDarkModeContext } from 'dark-mode-context';
import ModalCreateProposal from '@/Components/Molecules/ModalCreateProposal';
import { SortEnum } from '@/fetches/proposals';
import { useScope } from '@/Contexts/Scope';
import { useProjectOne } from '@/Contexts/ProjectOne';

interface VoteProps {
  user?: {
    id?: string;
  };
  vote?: 'yes' | 'no';
}

interface ProposalProps {
  id: number;
  title: string;
  description?: string;
  votes?: VoteProps[];
  status?: string;
  deadline?: string;
  treasury: any;
  approvalQuorum: number;
}

interface VotesProps {
  data: ProposalProps[];
}

const prepareHref = (href: string, address: string) => {
  if (href.includes('[address]')) {
    if (!address) return '';
    return href.replace('[address]', (address as string) || '');
  }
  return href;
};

function isPastDeadline(deadline: string) {
  const deadlineDate = new Date(deadline);

  const now = new Date();

  return now > deadlineDate;
}

const Votes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onSearch, setOnSearch] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(680);
  const [requestAction, setRequestAction] = useState('');
  const { isDarkMode } = useDarkModeContext();
  const router = useRouter();
  const address = useMemo(() => router.query.address, [router.query.address]);
  const { scopeTreasury } = useProjectOne();

  const dynamicPath = useMemo(
    () => getProposalsPaths(requestAction, String(address)),
    [address, requestAction]
  );

  const dynamicSearchPath = useMemo(
    () => getProposalSearchPath(requestAction, String(address), searchTerm),
    [address, requestAction, searchTerm]
  );

  const {
    data: proposals,
    isLoading: proposalsLoading,
    error,
    mutate
  } = useSWR<VotesProps>(onSearch ? dynamicSearchPath : dynamicPath, fetcher);

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const dynamicWidth = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) return setDrawerWidth(650);
    if (width >= 768 && width < 1024) return setDrawerWidth(600);
    if (width >= 640 && width < 768) return setDrawerWidth(450);
    if (width < 640) return setDrawerWidth(380);
  }, []);

  useEffect(() => {
    dynamicWidth();
  }, [dynamicWidth]);

  useEffect(() => {
    window.addEventListener('resize', dynamicWidth);

    return () => window.removeEventListener('resize', dynamicWidth);
  }, [dynamicWidth]);

  return (
    <Layout>
      <Card className="h-full rounded-3xl overflow-hidden px-2 sm:px-8 py-4 mt-10 border-none">
        <div className="flex justify-start items-center gap-5 pb-10">
          <Title fontSize={20} fontFamily="font-mono" isBold withMargin={false}>
            Votes
          </Title>
        </div>
        <div className="flex flex-col lg:flex-row mb-4 gap-4 ">
          <div className="flex w-full relative items-center">
            <SearchInput
              allowClear
              className="w-full"
              placeholder="Search for proposals"
              onSearch={(value) => {
                setOnSearch(!!value);
                setSearchTerm(value);
                setRequestAction('');
              }}
            />
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <Select
              className="w-[25%] lg:w-[80px] bg-[transparent] text-center"
              placeholder="Sort"
              onSelect={(value) => setRequestAction(value)}
              options={[
                {
                  label: 'Name ↑',
                  value: SortEnum.NAME_ASC
                },
                {
                  label: 'Name ↓',
                  value: SortEnum.NAME_DESC
                },
                {
                  label: 'Votes ↑',
                  value: SortEnum.VOTES_ASC
                },
                {
                  label: 'Votes ↓',
                  value: SortEnum.VOTES_DESC
                }
              ]}
            />
            {scopeTreasury.canBeWrite && (
              <Button
                className="w-[40%] lg:w-[100px]"
                // borderColor="border-text"
                // color="text-text"
                onClick={toggleModal}
              >
                Create
              </Button>
            )}
          </div>
        </div>

        {proposalsLoading ? (
          <div className="flex w-full justify-center items-center pt-7 pb-5">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {!proposals?.data?.length && (
              <div className="flex justify-center w-full pt-4">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>No proposals found</span>}
                />
              </div>
            )}

            {proposals?.data &&
              proposals?.data.map((proposal: ProposalProps, index: number) => {
                const totalVotes = proposal?.votes?.length || 0;
                const yesVotes =
                  proposal?.votes?.filter((vote) => vote?.vote === 'yes')
                    .length || 0;
                const noVotes =
                  proposal?.votes?.filter((vote) => vote?.vote === 'no')
                    .length || 0;
                const votingStatus =
                  yesVotes >= proposal?.approvalQuorum
                    ? 'Completed'
                    : isPastDeadline(proposal.deadline as string) &&
                      yesVotes < proposal.approvalQuorum
                    ? 'Defeated'
                    : 'Voting';
                const statusColor =
                  yesVotes >= proposal?.approvalQuorum
                    ? 'success'
                    : isPastDeadline(proposal.deadline as string) &&
                      yesVotes < proposal.approvalQuorum
                    ? 'error2'
                    : 'success';

                return (
                  <Card
                    key={index}
                    className="w-full max-w-[750px] rounded-2xl overflow-hidden px-0 py-0 mt-8 border-borderColor"
                    bodyStyle={{ paddingInline: 0, paddingBottom: '0px' }}
                  >
                    <div className="px-4 flex justify-between">
                      <div>
                        <Title
                          fontSize={24}
                          fontFamily="font-mono"
                          isBold
                          withMargin={false}
                        >
                          {proposal.title}
                        </Title>
                        {proposal.deadline && (
                          <Timer deadline={proposal.deadline} />
                        )}
                      </div>
                      <div className=" flex items-start">
                        <div className=" flex items-center">
                          <Text
                            className={`h-[fit-content] py-1 px-2 rounded-lg border-solid border-[0.50px] border-${statusColor}`}
                            fontSize={16}
                            color={`text-${statusColor}`}
                          >
                            {votingStatus}
                          </Text>
                          <Link
                            href={prepareHref(
                              `${ROUTES.VOTES.path}/${proposal.id}`,
                              address as string
                            )}
                            className={`flex items-center ${
                              isDarkMode ? 'text-white' : 'text-black'
                            }`}
                          >
                            <RightArrowIcon />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-stretch mt-8 border-solid border-0 border-t-[1px] border-borderColor w-full p-4">
                      <div className=" lg:pr-6 w-full lg:w-[50%]">
                        <div className="flex w-full  justify-between">
                          <div className=" text-success">
                            <Text fontSize={'14px'} color="text-[#a4acb7]">
                              Yes Votes
                            </Text>
                            <Text
                              fontSize={'18px'}
                              className="mt-2"
                              weight="bold"
                            >
                              {yesVotes}{' '}
                              <span className="text-[12px] font-[400] text-[#a4acb7]">
                                {' '}
                                {(yesVotes / totalVotes) * 100 || 0}%
                              </span>
                            </Text>
                          </div>
                          <div>
                            <Text fontSize={'14px'} color="text-[#a4acb7]">
                              No Votes
                            </Text>
                            <Text fontSize={'18px'} className="mt-2">
                              {noVotes}{' '}
                              <span className="text-[12px] font-[400] text-[#a4acb7]">
                                {' '}
                                {(noVotes / totalVotes) * 100 || 0}%
                              </span>
                            </Text>
                          </div>
                        </div>
                        {totalVotes === 0 && (
                          <div className="w-full h-[12px] bg-[#363d44] rounded mt-2" />
                        )}
                        {totalVotes !== 0 && (
                          <div className="w-full h-[12px] rounded mt-2 flex overflow-hidden">
                            <div
                              style={{
                                width: `${(yesVotes / totalVotes) * 100}%`
                              }}
                              className="bg-success"
                            />
                            <div
                              style={{
                                width: `${(noVotes / totalVotes) * 100}%`
                              }}
                              className="bg-error2"
                            />
                          </div>
                        )}
                      </div>
                      <Divider
                        type="vertical"
                        className="h-[auto] border-borderColor"
                      />
                      <div className="w-full lg:w-[50%] lg:pl-6 mt-4 lg:mt-0">
                        <Text fontSize={'14px'} color="text-[#a4acb7]">
                          Approval Quorum
                        </Text>
                        <Text fontSize={'16px'} className="mt-2">
                          {proposal.approvalQuorum > yesVotes
                            ? `${
                                proposal.approvalQuorum - yesVotes
                              } more yes votes required`
                            : 'Required approval achieved'}
                        </Text>
                        {yesVotes >= proposal.approvalQuorum && (
                          <div className="w-full h-[12px] bg-[success] rounded mt-2 overflow-hidden" />
                        )}
                        {yesVotes < proposal.approvalQuorum && (
                          <div className="w-full h-[12px] bg-[#363d44] rounded mt-2 overflow-hidden">
                            <div
                              style={{
                                width: `${
                                  (yesVotes / proposal.approvalQuorum) * 100
                                }%`
                              }}
                              className="h-full bg-[#a4acb7]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </Card>
      <ModalCreateProposal
        open={openModal}
        setOpen={setOpenModal}
        toggleModal={toggleModal}
        treasury={address as string}
        refreshData={mutate}
        drawerWidth={drawerWidth}
      />
    </Layout>
  );
};

export default Votes;
