import { Metaplex } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const connection = new Connection(process.env.APP_CUSTOM_RPC || clusterApiUrl('mainnet-beta'));
const metaplex = new Metaplex(connection);

export default metaplex;
