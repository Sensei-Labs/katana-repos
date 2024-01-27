import * as web3 from '@solana/web3.js';
import { APP_CUSTOM_RPC } from '../env';

const connection = new web3.Connection(APP_CUSTOM_RPC, 'confirmed');

export default connection;
