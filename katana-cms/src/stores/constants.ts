import {CurrencyEnum, TokenNameEnum} from "../../@types/currencyEnums";

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;

export const ENV = {
  COLLECTION_INTERVAL: Number(process.env.APP_COLLECTION_INTERVAL || 30) * ONE_MINUTE,
  SPL_TOKEN_INTERVAL: Number(process.env.APP_SPL_TOKEN_INTERVAL || 15) * ONE_MINUTE,
  NFT_INTERVAL: Number(process.env.APP_NFT_INTERVAL || 60) * ONE_MINUTE,
  TRANSACTIONS_INTERVAL: Number(process.env.APP_TRANSACTIONS_INTERVAL || 5) * ONE_MINUTE
};

export const TOKEN_ADDRESS_VALID_LIST = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    decimals: 6,
    symbol: CurrencyEnum.USDC,
    tokenName: TokenNameEnum.USDC,
    tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    tokenIcon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  }
}
