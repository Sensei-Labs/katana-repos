'use strict';

/**
 * treasury custom router
 */
module.exports = {
  routes: [
    // transactions
    {
      method: 'GET',
      path: '/transactions/get-sensei-transactions',
      handler: 'transaction.findAllSenseiTransactions'
    }
  ]
};
