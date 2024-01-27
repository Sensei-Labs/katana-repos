export const SENSEI_CREATOR_MACHINE_ADDRESS = process.env.SOLANA_CANDY_MACHINE_CREATOR || '';
export const APP_ASSET_SERVER_URL = process.env.APP_ASSET_SERVER_URL || 'ws://localhost:8080';
export const APP_NOTIFICATION_SERVER_URL = process.env.APP_NOTIFICATION_SERVER_URL || 'http://localhost:8082';
export const APP_ROYALTY_CATEGORY_ID = process.env.APP_ROYALTY_CATEGORY_ID || undefined;

export const STATUS_ENUM = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const DEFAULT_IMAGE_SOLANA = '/images/tokens/solana.svg';
