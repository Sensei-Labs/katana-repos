import { Strapi } from '@strapi/strapi';

import Util from '../../../utils';
import { TransactionDBType, TransactionFacadeType } from '../../transaction/types';
import { APP_ROYALTY_CATEGORY_ID } from '../../../config';

export async function mergeTransactions(
  transactionsFromBlock: TransactionFacadeType[],
  transactionsFromDB: TransactionDBType[]
) {
  const newList: TransactionFacadeType[] = [];
  const signatureListAddress = transactionsFromDB.map((item) => item.idSolscan);

  if (transactionsFromBlock.length === transactionsFromDB.length) {
    return {
      news: newList
    };
  }

  for (let index in transactionsFromBlock) {
    const item = transactionsFromBlock[index];
    const idSolscan = item?.idSolscan;
    if (!signatureListAddress.includes(idSolscan)) {
      newList.push(item);
      signatureListAddress.push(idSolscan);
    }
  }

  return { news: newList };
}

type PayloadProcessTransaction = Omit<TransactionDBType, 'id' | 'treasury' | 'walletAddressTrack'> & {
  treasury: number;
  walletAddressTrack: number;
};

export function formatPayloadTransaction(transaction: TransactionFacadeType, projectId: number): PayloadProcessTransaction {
  return {
    treasury: projectId,
    idSolscan: transaction.idSolscan,
    date: transaction?.date,
    tokenName: transaction?.tokenName,
    decimals: transaction?.decimals,
    symbol: transaction?.symbol,
    tokenIcon: transaction?.tokenIcon,
    signature: transaction?.signature,
    toUserAccount: transaction.toUserAccount,
    fromUserAccount: transaction.fromUserAccount,
    walletAddressTrack: transaction.walletAddressTrackId,
    direction: transaction.direction,
    tag: (transaction.direction === TRANSACTION_DIRECTION.IN.toUpperCase() && APP_ROYALTY_CATEGORY_ID
      ? {
          disconnect: [],
          connect: [
            {
              id: Number(APP_ROYALTY_CATEGORY_ID),
              position: { end: true }
            }
          ]
        }
      : undefined) as any,
    amount: transaction.amount
  };
}

export async function createTransactionsInDB({
  strapi,
  projectId,
  transactionsToCreate
}: {
  strapi: Strapi;
  projectId: number;
  transactionsToCreate: TransactionFacadeType[];
}) {
  if (!transactionsToCreate.length) return null;

  const output = await Util.asyncMap(transactionsToCreate, async (transactionBlock) => {
    const payload = formatPayloadTransaction(transactionBlock, projectId);
    try {
      const result = await strapi.entityService.create('api::transaction.transaction', {
        data: payload
      });
      return result;
    } catch (e) {
      console.log(payload);
      console.log(e?.details || e);
      return Promise.resolve(null);
    }
  });

  return output.filter(Boolean);
}

export enum TRANSACTION_DIRECTION {
  IN = 'in',
  OUT = 'out'
}

export function isValidTransactionType(transactionType?: TRANSACTION_DIRECTION) {
  return transactionType === 'in' || transactionType === 'out';
}
