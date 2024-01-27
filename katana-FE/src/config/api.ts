export const API_PREFIX = 'api';
export const API_VERSION = 'v1';

export const API_ROUTES = {
  WALLET_WHITE_LIST: {
    path: '/wallet-white-lists'
  },
  GET_ALL_TREASURIES: {
    path: '/treasuries/all'
  },
  SINGULAR_TREASURY: {
    path: '/treasury'
  },
  PLURAL_TREASURY_ADDRESS: {
    path: '/treasury-addresses'
  },
  PLURAL_NOTIFICATION: {
    path: '/push-notifications'
  },
  PLURAL_TREASURY: {
    path: '/treasuries'
  },
  PLURAL_MILESTONE: {
    path: '/milestones'
  },
  PLURAL_QUESTION: {
    path: '/questions'
  },
  PLURAL_ANSWER: {
    path: '/answers'
  },
  PLURAL_TASK: {
    path: '/tasks'
  },
  PLURAL_NEWS: {
    path: '/news'
  },
  GET_ALL_CATEGORY_TRANSACTIONS: {
    path: '/transactions-tags'
  },
  POST_SUBSCRIBE_TRANSACTIONS: {
    path: '/transactions/verify'
  },
  GET_ALL_TRANSACTIONS: {
    path: '/transactions'
  },
  GET_TREASURY_BY_ID: {
    path: '/treasuries/:id',
    params: {
      ID: ':id'
    }
  },
  GET_TREASURY_TAGS: {
    path: '/tags'
  },
  GET_PROFILE: {
    path: '/user-clients'
  },
  GET_OR_CREATE_CLIENT: {
    path: '/auth/new-get-or-create-client'
  },
  GET_DISCORD_URL: {
    path: '/discord/url'
  },
  LOGIN: {
    path: '/auth/local'
  },
  PLURAL_USERS: {
    path: '/users'
  },
  UPLOAD: {
    path: '/upload'
  },
  GET_USER: {
    path: '/users/me?populate=user_tags'
  },
  GET_REWARDS: {
    path: '/rewards?populate=*'
  },
  GET_QUESTS: {
    path: '/quests'
  },
  GET_AUCTION_ITEMS: {
    path: '/auction-items?populate=*'
  },
  VOTES: {
    path: '/votes'
  },
  CREATE_PROPOSAL: {
    path: '/proposals'
  },
  GET_PROPOSALS: {
    path: '/proposals?populate[votes][populate]=*&populate[treasury]=*'
  },
  GET_SINGLE_PROPOSALS: {
    path: '/proposals/[id]?populate[votes][populate]=*&populate[treasury]=*'
  }
};

export const getProposalsPaths = (requestAction: string, address: string) => {
  switch (requestAction) {
    case '':
      return `/proposals?filters[treasury][id][$eq]=${address}&populate[votes]=*&populate[treasury]=*`;
    case 'title:asc':
      return `/proposals?sort[0]=title:asc&filters[treasury][id][$eq]=${address}&populate[votes]=*&populate[treasury]=*`;
    case 'title:desc':
      return `/proposals?sort[0]=title:desc&filters[treasury][id][$eq]=${address}&populate[votes]=*&populate[treasury]=*`;
    case 'votes:asc':
      return `/proposals?sort[0]=votesCount:asc&filters[treasury][id][$eq]=${address}&populate[votes]=*&populate[treasury]=*`;
    case 'votes:desc':
      return `/proposals?sort[0]=votesCount:desc&filters[treasury][id][$eq]=${address}&populate[votes]=*&populate[treasury]=*`;
  }
};

export const getProposalSearchPath = (
  requestAction: string,
  address: string,
  searchTerm: string
) => {
  switch (requestAction) {
    case '':
      return `/proposals?filters[treasury][id][$eq]=${address}&filters[title][$containsi]=${searchTerm}&populate[votes]=*&populate[treasury]=*`;
    case 'title:asc':
      return `/proposals?sort[0]=title:asc&filters[treasury][id][$eq]=${address}&filters[title][$containsi]=${searchTerm}&populate[votes]=*&populate[treasury]=*`;
    case 'title:desc':
      return `/proposals?sort[0]=title:desc&filters[treasury][id][$eq]=${address}&filters[title][$containsi]=${searchTerm}&populate[votes]=*&populate[treasury]=*`;
    case 'votes:asc':
      return `/proposals?sort[0]=votesCount:asc&filters[treasury][id][$eq]=${address}&filters[title][$containsi]=${searchTerm}&populate[votes]=*&populate[treasury]=*`;
    case 'votes:desc':
      return `/proposals?sort[0]=votesCount:desc&filters[treasury][id][$eq]=${address}&filters[title][$containsi]=${searchTerm}&populate[votes]=*&populate[treasury]=*`;
  }
};
