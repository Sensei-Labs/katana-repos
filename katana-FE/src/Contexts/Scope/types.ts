import { PublicKey } from '@solana/web3.js';
import { CreatorType } from '@/types/nft';
import { TreasuryType } from '@/Contexts/Projects';

export type ScopeAddType = {
  isCreator: boolean;
  canBeWrite: boolean;
  canBeRead: boolean;
};

export type ScopeType = TreasuryType & ScopeAddType;

export interface TagElementProps {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface UserInfo {
  id: number;
  blocked: boolean;
  confirmed: boolean;
  email: string;
  username: string;
  walletAddress: string;
  avatar?: string;
  discordToken?: string;
  user_tags?: TagElementProps[];
  socialPoints: number;
  nickName?: string;
  twitterToken?: string;
  details?: string;
  tags?: string[];
}

export interface LoginDiscordInfoType {
  username: string;
  id: string;
  email: string;
  verified: boolean;
}

export type ScopeContextType = {
  hasAccess: boolean;
  isAuthenticated: boolean;
  loadingDiscordAuth: boolean;
  loading: boolean;
  initLoading: boolean;
  jwt: string | null;
  user: UserInfo | null;
  discordUserInfo: LoginDiscordInfoType | null;
  onLoginDiscordAndGetScopeInBackend: (
    code: string
  ) => Promise<LoginDiscordInfoType>;
  userCommunity?: UserInfo;
  onLogout: () => Promise<any>;
  onLogin: (payload: LoginDiscordInfoType) => Promise<any>;
  getScopeForProject: (treasuryId: number) => ScopeAddType;
  hasSenseiToken: boolean;
  scope: ScopeType[];
};

export type NFTTokenType = {
  creators: CreatorType[];
  collection?: {
    key: PublicKey;
    address: PublicKey;
    verify: boolean;
  };
  marketInfo?: {
    owner: string;
    mintAddress: string;
    name?: string;
    symbol?: string;
    image?: string;
    amount?: number;
    priceUsd?: number;
    priceSol?: number;
  };
  image: string;
  description: string;
  isMutable: boolean;
  isValidToken: boolean;
  address: PublicKey;
  mintAddress: PublicKey;
  mint: {
    address: PublicKey;
  };
  name: string;
  sellerFeeBasisPoints: number;
  symbol: string;
  uri: string;
};

export type ServerResponseType = Pick<
  ScopeContextType,
  'hasSenseiToken' | 'hasAccess' | 'scope'
>;
