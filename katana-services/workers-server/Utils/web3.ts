import * as web3 from '@solana/web3.js';

export const PublicKey = (address: string) => new web3.PublicKey(address);
