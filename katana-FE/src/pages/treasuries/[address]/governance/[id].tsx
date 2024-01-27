import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/Components/Organisms/Layout';
import { Card, Divider, Spin } from 'antd';

import { API_ROUTES } from '@/config/api';
import { api, fetcher } from '@/services/api';
import { useScope } from '@/Contexts/Scope';

import useSWR, { mutate } from 'swr';
import Title from '@/Components/Atoms/Title';
import Text from '@/Components/Atoms/Text';
import Timer from '@/Components/Organisms/Timer';
import Button from '@/Components/Atoms/Button';
import { updateProposal } from '@/fetches/proposals';

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
  data: ProposalProps;
}

const prepareHref = (href: string, id: string) => {
  if (href.includes('[id]')) {
    if (!id) return '';
    return href.replace('[id]', (id as string) || '');
  }
  return href;
};

function isPastDeadline(deadline: string) {
  const deadlineDate = new Date(deadline);

  const now = new Date();

  return now > deadlineDate;
}

const Proposal = () => {
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [voteType, setVoteType] = useState<string>();
  const { userCommunity: user } = useScope();
  const router = useRouter();
  const id = useMemo(() => router.query.id, [router.query.id]);

  const {
    data: proposal,
    isLoading: proposalLoading,
    error
  } = useSWR<VotesProps>(
    prepareHref(API_ROUTES.GET_SINGLE_PROPOSALS.path, id as string),
    fetcher
  );

  const createVote = async (
    userId: number,
    proposalId: number,
    vote: 'yes' | 'no'
  ) => {
    setCreateLoading(true);
    const newData = { ...proposal, votes: proposal?.data.votes + vote };
    console.log({ newData });
    mutate('/api/votes', newData, false);
    try {
      const response = await api.post(API_ROUTES.VOTES.path, {
        data: {
          user: userId,
          proposal: proposalId,
          vote: vote
        }
      });

      if (response.status === 200) {
        await updateProposal(String(proposalId));
        mutate(prepareHref(API_ROUTES.GET_SINGLE_PROPOSALS.path, id as string));
      }

      setCreateLoading(false);
    } catch (error) {
      console.error(error);
      mutate(
        prepareHref(API_ROUTES.GET_SINGLE_PROPOSALS.path, id as string),
        proposal,
        false
      );
      setCreateLoading(false);
    }
  };

  const totalVotes = useMemo(() => {
    return proposal?.data.votes?.length || 0;
  }, [proposal]);

  const yesVotes = useMemo(() => {
    return (
      proposal?.data.votes?.filter((vote) => vote?.vote === 'yes').length || 0
    );
  }, [proposal]);

  const noVotes = useMemo(() => {
    return (
      proposal?.data.votes?.filter((vote) => vote?.vote === 'no').length || 0
    );
  }, [proposal]);

  const userHasVoted = useMemo(() => {
    return (
      proposal?.data.votes?.some(
        (vote) => vote?.user?.id === user?.id || false
      ) || false
    );
  }, [proposal, user]);
  console.log({ proposal });
  const { votingStatus, statusColor } = useMemo(() => {
    if (!proposal) return { votingStatus: '', statusColor: '' };
    const hasReachedQuorum = yesVotes >= proposal?.data.approvalQuorum;
    const isPast = isPastDeadline(proposal?.data?.deadline as string);

    const computedVotingStatus = hasReachedQuorum
      ? 'Completed'
      : isPast && !hasReachedQuorum
      ? 'Defeated'
      : 'Voting';
    const computedStatusColor = hasReachedQuorum
      ? 'success'
      : isPast && !hasReachedQuorum
      ? 'error2'
      : 'success';

    return {
      votingStatus: computedVotingStatus,
      statusColor: computedStatusColor
    };
  }, [yesVotes, proposal]);

  if (proposalLoading) {
    return (
      <Layout>
        <Card className="h-full rounded-3xl overflow-hidden px-2 sm:px-8 py-4 mt-10 border-none">
          <div className="flex w-full justify-center items-center pt-7 pb-5">
            <Spin size="large" />
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="h-full rounded-3xl overflow-hidden px-2 sm:px-8 py-4 mt-10 border-none">
        {proposal && (
          <>
            <div className="flex justify-between items-center gap-5 pb-10">
              <Title
                fontSize={20}
                fontFamily="font-mono"
                isBold
                withMargin={false}
              >
                {proposal.data.title}
              </Title>
              <Text
                className={`h-[fit-content] py-1 px-2 rounded-lg border-solid border-[0.50px] border-${statusColor}`}
                fontSize={16}
                color={`text-${statusColor}`}
              >
                {votingStatus}
              </Text>
            </div>
            <div>
              <Text>{proposal.data.description}</Text>
            </div>
            <div className="my-6 flex justify-between items-center">
              <Text fontSize={20}>Voting Now</Text>
              <Timer deadline={proposal.data.deadline as string} />
            </div>
            <div className="bg-background p-4 rounded-lg">
              <div className="flex flex-col lg:flex-row justify-stretch mt-8 border-0 w-full p-4">
                <div className=" lg:pr-6 w-full lg:w-[50%]">
                  <div className="flex w-full  justify-between">
                    <div className=" text-success">
                      <Text fontSize={'14px'} color="text-[#a4acb7]">
                        Yes Votes
                      </Text>
                      <Text fontSize={'18px'} className="mt-2" weight="bold">
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
                        style={{ width: `${(yesVotes / totalVotes) * 100}%` }}
                        className="bg-success"
                      />
                      <div
                        style={{ width: `${(noVotes / totalVotes) * 100}%` }}
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
                    {proposal.data.approvalQuorum > yesVotes
                      ? `${
                          proposal.data.approvalQuorum - yesVotes
                        } more yes votes required`
                      : 'Required approval achieved'}
                  </Text>
                  {yesVotes >= proposal.data.approvalQuorum && (
                    <div className="w-full h-[12px] bg-[success] rounded mt-2 overflow-hidden" />
                  )}
                  {yesVotes < proposal.data.approvalQuorum && (
                    <div className="w-full h-[12px] bg-[#363d44] rounded mt-2 overflow-hidden">
                      <div
                        style={{
                          width: `${
                            (yesVotes / proposal.data.approvalQuorum) * 100
                          }%`
                        }}
                        className="h-full bg-[#a4acb7]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="my-12 flex justify-between items-center">
              <Text fontSize={20}>Cast Your Vote</Text>
            </div>
            {userHasVoted && <Text>You have already voted</Text>}
            {!user && <Text>You need to login before you cast your vote</Text>}
            {user && !userHasVoted && (
              <div className="flex justify-center items-center gap-6">
                <Button
                  onClick={() => {
                    setVoteType('yes');
                    createVote(user.id, proposal.data.id, 'yes');
                  }}
                  bgColor="bg-transparent"
                  borderColor="border-text"
                  className="px-8"
                  hasLoading
                  isLoading={voteType === 'yes' ? createLoading : false}
                >
                  <Text>Vote Yes</Text>
                </Button>
                <Button
                  onClick={() => {
                    setVoteType('no');
                    createVote(user.id, proposal.data.id, 'no');
                  }}
                  bgColor="bg-transparent"
                  borderColor="border-text"
                  className="px-8"
                  hasLoading
                  isLoading={voteType === 'no' ? createLoading : false}
                >
                  <Text>Vote No</Text>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Proposal;
