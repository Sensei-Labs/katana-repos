import { ROUTES } from '@/config';
import {
  Category,
  Document,
  Swap,
  Setting,
  User,
  Wallet,
  Ticket,
  Calendar,
  People,
  TicketStar
} from 'react-iconly';

import Nft from '@/Components/Atoms/Icons/NFT';
import News from '@/Components/Atoms/Icons/News';
import MessageQuestion from '@/Components/Atoms/Icons/MessageQuestion';

export const SettingsKey = 'settings';

const menu = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    href: ROUTES.DASHBOARD.path,
    icon: <Category set="bold" />
  },
  {
    key: 'milestones',
    title: 'Milestones',
    href: ROUTES.MILESTONE.path,
    icon: <Document set="bold" />
  },
  {
    key: 'transactions',
    title: 'Transactions',
    href: ROUTES.TRANSACTIONS.path,
    icon: <Swap set="bold" />
  },
  {
    key: 'nfts',
    title: 'NFTs',
    href: ROUTES.NFTs.path,
    icon: <Nft />
  },
  {
    key: 'news',
    title: 'News',
    href: ROUTES.NEWS.path,
    icon: <News />
  },
  {
    key: 'discussion',
    title: 'Discussion',
    href: ROUTES.DISCUSSION.path,
    icon: <MessageQuestion />
  },
  {
    key: 'governance',
    title: 'Governance',
    href: ROUTES.VOTES.path,
    icon: <People set="bold" />
  },
  // {
  //   key: 'multi-sig',
  //   title: 'Multi-Sig',
  //   href: ROUTES.MULTI_SIG.path,
  //   icon: <MultiSign />
  // },
  {
    key: SettingsKey,
    title: 'Settings',
    href: ROUTES.SETTINGS.path,
    icon: <Setting set="bold" />
  }
];

export default menu;

export const dojoAsideList = [
  {
    key: 'profile',
    title: 'Profile',
    href: ROUTES.PROFILE.path,
    icon: <User set="bold" />
  },
  {
    key: 'rewards',
    title: 'Rewards',
    href: ROUTES.REWARDS.path,
    icon: <TicketStar set="bold" />
  },
  {
    key: 'quests',
    title: 'Quests',
    href: ROUTES.QUESTS.path,
    icon: <Calendar set="bold" />
  },
  {
    key: 'leaderboard',
    title: 'Leaderboard',
    href: ROUTES.LEADERBOARD.path,
    icon: <People set="bold" />
  },
  {
    key: 'auction-dojo',
    title: 'Auction Dojo',
    href: ROUTES.AUCTION.path,
    icon: <Ticket set="bold" />
  }
];
