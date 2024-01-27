declare type StrapiUser = {
  id: number;
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken: null;
  confirmationToken: null;
  confirmed: boolean;
  blocked: boolean;
  walletAddress: string;
  avatar: string;
  nickName: string | null;
  createdAt: string;
  updatedAt: string;
  discordToken: string | null;
  twitterToken: string | null;
  role: {
    id: number;
    name: 'Authenticated';
    description: string;
    type: 'authenticated';
    createdAt: string;
    updatedAt: string;
  };
};
