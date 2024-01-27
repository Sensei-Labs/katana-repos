import BigNumber from 'bignumber.js';
import { NFTTokenType } from '@/types/nft';

function formatAmount(value: number) {
  return new BigNumber(value).dividedBy(1000000000).toNumber();
}

const TRANSACTION_TYPE = 'TRANSFER';

function formatTransaction(transaction: TransactionHeliusType) {
  const amount = transaction?.nativeTransfers?.length
    ? transaction?.nativeTransfers[0].amount
    : 0;
  return {
    ...transaction,
    amount: formatAmount(amount)
  };
}

export function formatTransactionsForTransfer(
  transactionsForArray: TransactionReturnType[]
): TransactionReturnType[] {
  return transactionsForArray.map((item) => {
    return {
      ...item,
      transactions: item.transactions
        .filter((transaction) => transaction.type === TRANSACTION_TYPE)
        .map(formatTransaction)
    };
  });
}
