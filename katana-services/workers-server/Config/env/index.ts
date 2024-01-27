export const APP_INTERVAL_EXEC = Number(process.env.APP_INTERVAL_EXEC ?? '0');
export const APP_DATABASE_URI = process.env.APP_DATABASE_URI || '';

export const APP_CMS_URL = process.env.APP_CMS_URL || 'http://localhost:1337';

export const APP_CMS_TOKEN = process.env.APP_CMS_TOKEN || 'http://localhost:1337';

export const APP_SOLSCAN_API_KEYS = JSON.parse(process.env.APP_SOLSCAN_API_KEYS || '[]');

export const APP_CUSTOM_RPC = process.env.APP_CUSTOM_RPC || 'https://api.mainnet-beta.solana.com';

export const APP_DISABLED_WORKER = JSON.parse(process.env.APP_DISABLED_WORKER || 'false');
export const APP_ENABLED_LOGGER = process.env.APP_ENABLED_LOGGER === 'true';

export const APP_DISABLED_LOOP = JSON.parse(process.env.APP_DISABLED_LOOP || 'false');
