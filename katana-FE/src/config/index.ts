import * as process from 'process';
import { contextNames } from '@/Contexts';
import { api } from '@/services/api';
import { API_ROUTES } from '@/config/api';

export const API_UPLOAD_FILE = `${api.getUri()}${API_ROUTES.UPLOAD.path}`;

export const isProd = process.env.NODE_ENV === 'production';

export const APP_CUSTOM_RPC = process.env.NEXT_PUBLIC_APP_CUSTOM_RPC || '';

export const AUTH_SPECIAL_INFO_KEY = '@auto-special-info';

export const AUTH_RESPONSE_SCOPE = '@auth-scope';

export const GET_SEPARATOR_FILE = process.env.NEXT_PUBLIC_SEPARATOR_FILE || ',';
export const ASSET_SERVER_URL =
  process.env.NEXT_PUBLIC_ASSET_SERVER_URL || 'ws://localhost:8080';
export const NOTIFICATION_SERVER_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVER_URL || 'ws://localhost:8082';

export const AUTH_DISCORD_INFO_USER_KEY = '@discord-info-user';

export const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || '';

export const BASE_PATH_PROJECT_DETAILS = '/treasuries/[address]';
export const BASE_DOJO_PATH = '/dojo';

export const ROUTES = {
  DASHBOARD: {
    path: `${BASE_PATH_PROJECT_DETAILS}/dashboard`,
    context: contextNames.PROJECT_DETAILS,
    params: {
      address: '[address]'
    }
  },
  MILESTONE: {
    path: BASE_PATH_PROJECT_DETAILS + '/milestone',
    context: contextNames.PROJECT_DETAILS,
    params: {
      address: '[address]'
    }
  },
  TRANSACTIONS: {
    path: BASE_PATH_PROJECT_DETAILS + '/transactions',
    context: contextNames.PROJECT_DETAILS,
    params: {
      address: '[address]'
    }
  },
  SETTINGS: {
    path: BASE_PATH_PROJECT_DETAILS + '/settings',
    context: contextNames.PROJECT_DETAILS,
    params: {
      address: '[address]'
    }
  },
  NFTs: {
    path: BASE_PATH_PROJECT_DETAILS + '/nft',
    context: contextNames.PROJECT_DETAILS,
    params: {
      address: '[address]'
    }
  },
  NEWS: {
    context: contextNames.PROJECT_DETAILS,
    path: BASE_PATH_PROJECT_DETAILS + '/news',
    params: {
      address: '[address]'
    }
  },
  VOTES: {
    path: BASE_PATH_PROJECT_DETAILS + '/governance',
    context: contextNames.PROJECT_DETAILS,
    params: {
      address: '[address]'
    }
  },
  DISCUSSION: {
    context: contextNames.PROJECT_DETAILS,
    path: BASE_PATH_PROJECT_DETAILS + '/discussion',
    params: {
      address: '[address]'
    }
  },
  DISCUSSION_DETAIL: {
    context: contextNames.PROJECT_DETAILS,
    path: BASE_PATH_PROJECT_DETAILS + '/discussion/[id]',
    params: {
      address: '[address]',
      id: '[id]'
    }
  },
  NOT_FOUND: {
    path: '/404',
    context: ''
  },
  SELECT_WALLET: {
    path: '/',
    context: ''
  },
  LOGIN: {
    path: '/',
    context: ''
  },
  TREASURIES: {
    context: contextNames.TREASURIES_LIST,
    path: '/treasuries'
  },
  LOANS: {
    context: '',
    path: '/loans'
  },
  DOJO: {
    context: '',
    path: '/dojo'
  },
  PROFILE: {
    path: BASE_DOJO_PATH + '/profile',
    context: ''
  },
  REWARDS: {
    path: BASE_DOJO_PATH + '/rewards',
    context: ''
  },
  QUESTS: {
    path: BASE_DOJO_PATH + '/quests',
    context: ''
  },
  LEADERBOARD: {
    path: BASE_DOJO_PATH + '/leaderboard',
    context: ''
  },
  AUCTION: {
    path: BASE_DOJO_PATH + '/auction',
    context: '',
    params: {
      id: '[id]'
    }
  },
  MULTI_SIG: {
    context: '',
    path: '/multi-sig'
  },
  MAGIC_EDEN_SENSEI_LABS: {
    context: '',
    path: 'https://magiceden.io/marketplace/sensei_labs'
  },
  DISCORD: {
    context: '',
    path: 'http://discord.gg/URKNzJabdv'
  },
  TWITTER: {
    context: '',
    path: 'https://twitter.com/SenseiLabsNFT'
  },
  DISCORD_AUTH: {
    context: '',
    path: '/oauth/discord'
  },
  TWITTER_AUTH: {
    context: '',
    path: '/oauth/twitter'
  }
};
