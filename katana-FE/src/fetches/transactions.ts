import { api } from '@/services/api';
import { API_ROUTES } from '@/config/api';

export function verifyTransactions(
  transactionsList: TransactionReturnType[],
  treasuryId: number
) {
  const path = `${API_ROUTES.POST_SUBSCRIBE_TRANSACTIONS.path}`;

  return api.post(path, {
    treasuryId,
    transactionList: transactionsList
  });
}

export function getAllTransactionByProject<T = any>(treasuryId: number) {
  const path = `${API_ROUTES.PLURAL_TREASURY.path}/${treasuryId}/transactions`;

  return api.get<T>(path);
}

export function updateTransaction(
  id: number,
  payload: {
    tag?: { connect?: number[]; disconnect?: number[] };
    description?: string | null;
  }
) {
  const path = `${API_ROUTES.GET_ALL_TRANSACTIONS.path}/${id}`;

  return api.put(path, {
    data: payload
  });
}
