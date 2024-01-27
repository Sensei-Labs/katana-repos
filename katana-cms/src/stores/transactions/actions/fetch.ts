import { Strapi } from '@strapi/strapi';
import { TransactionFacadeType, TransactionSolscanSPLType, TransactionSolscanType } from '../../../api/transaction/types';
import { fetchSolscanInstance, ResponseSolscanTransaction } from '../../../services/fetch';
import { formatTransactionsFromSolana, formatTransactionsFromSPLTokens } from '../../../utils/format';
import { CurrencyEnum } from '../../../../@types/currencyEnums';
import { TreasuryAccountType } from '../../../api/treasury-address/types';

type GenericResponseType = (
  strapi: Strapi,
  account: TreasuryAccountType,
  offset: number,
  limit: number
) => Promise<{
  data: {
    hasNext: boolean;
    transactions: TransactionFacadeType[];
  } | null;
  error: null | any;
}>;

export const getSolanaTransactions: GenericResponseType = async (strapi, account, offset, limit = 50) => {
  try {
    const params = {
      account: account?.address,
      offset,
      limit,
      cluster: ''
    };

    const { data } = await fetchSolscanInstance.get<{ data: TransactionSolscanType[] }>(
      'https://public-api.solscan.io/account/solTransfers',
      { params }
    );

    const transactions = formatTransactionsFromSolana(data?.data || [], account);
    const transactionsFiltered = transactions.filter((tx) => {
      if (account.isRoyalty) return true;
      return tx.toUserAccount !== account.address && tx.fromUserAccount === account.address;
    });

    return {
      data: {
        hasNext: Boolean(data?.data?.length),
        transactions: transactionsFiltered
      },
      error: null
    };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: e
    };
  }
};

export const getSPLTransactions: GenericResponseType = async (strapi, account, offset, limit = 50) => {
  const params = {
    account: account?.address,
    offset,
    limit
  };
  try {
    const { data: dataSPL } = await fetchSolscanInstance.get<ResponseSolscanTransaction<TransactionSolscanSPLType>>(
      'https://public-api.solscan.io/account/splTransfers',
      {
        params
      }
    );

    const transactions = dataSPL.data.filter((tx) => {
      if (!tx.symbol) return false;
      const isValidTokenSymbol = tx.symbol === CurrencyEnum.USDC && tx.address !== account.address;
      const isOutputTransfer = tx.changeAmount < 0;

      if (account.isRoyalty && isValidTokenSymbol) return true;
      return isOutputTransfer && isValidTokenSymbol;
    });

    return {
      data: {
        hasNext: Boolean(dataSPL?.data?.length),
        transactions: formatTransactionsFromSPLTokens(transactions || [], account, strapi)
      },
      error: null
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: error
    };
  }
};
