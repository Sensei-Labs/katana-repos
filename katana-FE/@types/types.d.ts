type NFTTokenType = import('../src/types/nft').NFTTokenType;

type CSSProperties = import('react').CSSProperties;

declare module '*module.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}

declare interface BaseComponent {
  className?: string;
  id?: string;
  style?: CSSProperties;
}

declare interface FileServerType {
  id: string;
  name: string;
  mime: string;
  url: string;
  height?: number;
  width?: string;
}

enum ResponseStatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

declare interface ResponseServer<T = any> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
  error: {
    details: Record<string, any>;
    message: string;
    name: string;
    status: ResponseStatusCode;
  };
}

type AttributesType = {
  [key: string]: string;
};

type CreatorType = {
  address: string;
  share: number;
  verified: number;
};

type TokenHeliusType = {
  mint: string;
  offChainData: {
    attributes: AttributesType[];
    description: string;
    image: string;
    name: string;
    properties: {
      category: string;
      creators: Omit<CreatorType, 'verified'>[];
    };
    sellerBasicPoint: number;
    symbol: string;
  };
  onChainData: {
    collection: {
      key: string;
      verified: boolean;
    };
    data: {
      creators: CreatorType[];
      name: string;
      symbol: string;
      uri: string;
    };
    isMutable: boolean;
    mint: string;
  };
};

type CollectionType = {
  key: number;
  name: string;
  address?: string;
  collectionInfo: {
    collection: string;
    collectionName: string;
    collectionPrice: number;
    collectionPriceUsd: number;
  };
  page: number;
  tokenList: NFTTokenType[];
  docs: any[];
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  isValidNext: boolean;
  isValidPrev: boolean;
};

type TransactionHeliusType = {
  accountData: any[];
  description: string;
  events: {
    nft: {
      amount: number;
      buyer: string;
      description: string;
      fee: number;
      feePayer: string;
      nfts: [];
      saleType: string;
      seller: string;
      signature: string;
      slot: number;
      source: string;
      staker: string;
      timestamp: number;
      type: string;
    };
  };
  fee: number;
  feePayer: string;
  instructions: any[];
  nativeTransfers: any[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: any[];
  transactionError: null;
  type: string;
};

type TransactionReturnType = {
  address: string;
  transactions: TransactionHeliusType[];
};

type PaginationType = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

declare type PaginationServer<DataType = any> = {
  data: DataType[];
  meta: {
    pagination: PaginationType;
  };
};

declare type DirectionType = 'IN' | 'OUT';

declare type TransactionType = {
  id: number;
  signature: string;
  toUserAccount: string;
  fromUserAccount: string;
  walletAddressTrack: {
    id: number;
    label: string;
    address: string;
    color: string;
  };
  date: string;
  description?: string;
  tag?: {
    id: number;
    name: string;
    color: string;
  };
  amount: number;
  direction: DirectionType;
  amountFormatted: {
    original: number;
    format: string;
    amount: number;
    symbol: string;
    usd: number;
  };
  decimals: number;
  symbol: CurrencyType;
  tokenIcon: CurrencyType;
  tokenName: 'Solana' | 'USD Coin';
};
