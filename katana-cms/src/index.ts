import { updateTransactions } from './workers/updateTransactions';
import AssetServer from './services/assetServer';
import notificationServer from './services/pushNotifications';

import { CurrencyEnum } from '../@types/currencyEnums';
import SolscanApiKeyStore from './stores/solscanApiKey';
// import { resolveTransactionsFixed } from './workers/correctionTransactions';

const apiSolscanApiKey = new SolscanApiKeyStore();

export default {
  register(/*{ strapi }*/) {},
  async bootstrap({ strapi }) {
    const isWorkerTransactionEnable = process.env.APP_WORKER_TRANSACTIONS_STOP !== 'true';

    if (isWorkerTransactionEnable) {
      // update transactions from all projects every 15min
      console.log('Transactions worker enable, set APP_WORKER_TRANSACTIONS_STOP to *true* to disabled it');
      updateTransactions({ strapi });
    } else {
      console.log('Cancel worker transactions, set APP_WORKER_TRANSACTIONS_STOP to false to enable it');
    }

    console.log(`Loading api keys for solscan...`);
    try {
      await apiSolscanApiKey.initCache();
    } catch (e) {
      console.log(`Cache api key solscan not init `, e);
    }
    console.log(`Finish loading`);

    // resolveTransactionsFixed({ strapi });

    strapi.princingServer = AssetServer([CurrencyEnum.SOL, CurrencyEnum.USDC]);
    strapi.pushNotificationService = notificationServer();
  }
};
