import Util from '../../../utils';

export function preCleanArrayTransactions(transactions) {
  return Util.map(transactions, (transaction) => {
    const walletAddressTrack = transaction?.attributes?.walletAddressTrack;
    return {
      id: transaction.id,
      ...transaction.attributes,
      walletAddressTrack: walletAddressTrack
        ? {
            id: walletAddressTrack?.data.id,
            ...walletAddressTrack?.data.attributes
          }
        : null
    };
  });
}
