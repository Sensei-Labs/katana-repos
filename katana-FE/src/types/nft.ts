import { PublicKey } from '@solana/web3.js';
import { NFTTokenType as NFTTokenTypeBase } from '@/Contexts/Scope/types';

export type CreatorType = {
  address: PublicKey;
  share: number;
  verified: boolean;
};

export type NFTTokenType = NFTTokenTypeBase;
