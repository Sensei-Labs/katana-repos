export type TokenMetaSolscan = {
  symbol: string;
  name: string;
  icon: string;
  website: string;
  twitter: string;
  tag: any[];
  decimals: number;
  coingeckoId: string;
  holder: number;
};

export type MagicEdenTokenPrice = {
  pdaAddress: string;
  tokenMint: string;
  auctionHouse: string;
  buyer: string;
  buyerReferral: string;
  tokenSize: number;
  price: number;
  expiry: number;
};

export type TokenAccountSolscan = {
  tokenAddress: string;
  symbol: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
  tokenAccount: string;
  tokenName: string;
  amount?: number;
  amountSol?: number;
  tokenIcon: string;
  rentEpoch: number;
  lamports: number;
};
