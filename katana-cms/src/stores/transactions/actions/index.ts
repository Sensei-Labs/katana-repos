import { TransactionFacadeType } from '../../../api/transaction/types';

import Utils from '../../../utils';
import { cacheTransactionStore } from '../index';
import { TreasuryAccountType } from '../../../api/treasury-address/types';
import { getSolanaTransactions, getSPLTransactions } from './fetch';
import { Strapi } from '@strapi/strapi';
import BigNumber from 'bignumber.js';

const getAllTransactions = async (strapi: Strapi, accountAddresses: TreasuryAccountType[] = []) => {
  const LIMIT = 50;

  const allTransactionForAccount: TransactionFacadeType[] = [];

  // Solana Transactions
  await Utils.asyncMap(accountAddresses, async (account) => {
    const paginationSolana = {
      hasNext: true,
      totalCount: 0
    };

    while (paginationSolana.hasNext) {
      const { data, error } = await getSolanaTransactions(strapi, account, paginationSolana.totalCount, LIMIT);

      if (!data && !!error) return null;
      if (data?.hasNext) paginationSolana.totalCount += LIMIT;

      paginationSolana.hasNext = data?.hasNext;
      const transactions = data.transactions || [];
      allTransactionForAccount.push(...transactions);
    }
  });

  // SPL transactions
  await Utils.asyncMap(accountAddresses, async (account) => {
    const paginationSpl = {
      hasNext: true,
      totalCount: 0
    };
    while (paginationSpl.hasNext) {
      const { data: txs, error } = await getSPLTransactions(strapi, account, paginationSpl.totalCount, LIMIT);

      if (!txs && !!error) return null;
      if (txs?.hasNext) paginationSpl.totalCount += LIMIT;

      paginationSpl.hasNext = txs?.hasNext;
      const transactions = txs.transactions || [];
      allTransactionForAccount.push(...transactions);
    }
  });

  return allTransactionForAccount.filter(Boolean).map((tx) => ({
    ...tx,
    amount: BigNumber(tx?.amount || 0).abs().toNumber()
  }));
};

export async function getTransactionsInfoFromCache({
  projectId,
  strapi,
  accountAddresses = [],
  findInCache = true
}: {
  strapi: Strapi;
  projectId: number;
  accountAddresses: TreasuryAccountType[];
  findInCache?: boolean;
}) {
  const cacheStore = await cacheTransactionStore;
  const dataCache = await cacheStore.get(projectId);

  if (dataCache && findInCache) {
    console.log('--- Transactions cache found ---');
    return dataCache;
  }
  const data = await getAllTransactions(strapi, accountAddresses);
  await cacheStore.set(projectId, data);
  return data as TransactionFacadeType[];
}
