// import sqliteStore from 'cache-manager-sqlite';
import { ENV } from '../constants';
const cacheManager = require('cache-manager');

export const cacheTransactionStore = cacheManager.caching('memory', {
  ttl: ENV.TRANSACTIONS_INTERVAL
});

// const cacheTransactionSQLiteStore = cacheManager.caching({
//   store: sqliteStore,
//   options: {
//     serializer: 'json',
//     ttl: ENV.TRANSACTIONS_INTERVAL
//   }
// });
