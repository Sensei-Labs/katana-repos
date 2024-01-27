export enum StatusProjectEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'draft'
}

export type TreasuryDBType = {
  id: string;
  name: string;
  description: string;
  creator?: any;
  thumbnail: any;
  status: StatusProjectEnum;
  frontPage: any;
  tags?: any[];
  treasuryAddresses: any[];
  acceptedCollectionAddress: string[];
  discordLink?: string;
  twitterUser?: string;
  websiteLink?: string;
  collection_nfts_addresses?: any[];
  milestones?: any[];
  questions?: any[];
  access?: any[];
  moreLinks?: any[];
  news?: any[];
  proposals?: any[];
  adminDiscordRolesID?: string[];
  discordID: string;
  accessDiscordRolesID?: string[];
};
