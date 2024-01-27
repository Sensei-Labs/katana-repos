import { TransactionFacadeType } from '../../types';
import { TRANSACTIONS_TYPE } from '../../../../services/project';

export function filterForInTransaction(transaction: TransactionFacadeType): boolean {
  return transaction.direction === 'IN' && !!transaction?.tag;
}

export function filterForOutTransaction(transaction: TransactionFacadeType): boolean {
  return !!transaction?.tag?.id && transaction.direction === 'OUT';
}

export function resolveDirectionTransaction(type: TRANSACTIONS_TYPE) {
  const mapper = {
    [TRANSACTIONS_TYPE.IN]: filterForInTransaction,
    [TRANSACTIONS_TYPE.OUT]: filterForOutTransaction
  };
  return mapper[type];
}
