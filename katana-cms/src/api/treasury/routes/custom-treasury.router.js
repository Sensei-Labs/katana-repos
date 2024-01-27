'use strict';

/**
 * treasury custom router
 */
module.exports = {
  routes: [
    // treasuries
    {
      method: 'GET',
      path: '/treasuries/all',
      handler: 'treasury.getTreasuriesForUI'
    },
    // collections
    {
      method: 'GET',
      path: '/treasury/:id/collections-info',
      handler: 'treasury.getCollectionsInfo'
    },
    {
      method: 'POST',
      path: '/treasury/:id/acceptedCollectionAddress',
      handler: 'treasury.addAcceptedCollectionAddress'
    },
    {
      method: 'DELETE',
      path: '/treasury/:id/acceptedCollectionAddress/:acceptedCollectionAddress',
      handler: 'treasury.deleteAcceptedCollectionAddress'
    },
    // access
    {
      method: 'POST',
      path: '/treasury/:id/addCanBeWriter',
      handler: 'treasury.addAddressCanBeWrite'
    },
    {
      method: 'POST',
      path: '/treasury/:id/addTreasuryAddress',
      handler: 'treasury.addTreasuryAddress'
    },
    // transactions
    {
      method: 'GET',
      path: '/treasuries/:projectId/update-transactions',
      handler: 'treasury.updateTransactionsForProject',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/treasuries/:projectId/transactions',
      handler: 'treasury.allTransactionsForProject'
    },
    {
      method: 'GET',
      path: '/treasuries/:projectId/statistic-amount',
      handler: 'treasury.statisticAmountForProject'
    },
    {
      method: 'GET',
      path: '/treasuries/:projectId/statistic-category',
      handler: 'treasury.statisticCategoryForProject'
    },
    {
      method: 'GET',
      path: '/treasuries/:projectId/spl-transactions',
      handler: 'treasury.getSPLTransactions'
    },
    {
      method: 'POST',
      path: '/treasuries/:projectId/update-amount-graph',
      handler: 'treasury.createStatisticAmountForProject'
    },
    {
      method: 'POST',
      path: '/treasuries/:projectId/update-category-graph',
      handler: 'treasury.createStatisticCategoryForProject'
    },
    // nfts
    {
      method: 'GET',
      path: '/treasuries/:projectId/nfts',
      handler: 'treasury.allNFTsForProject'
    },
    // Metadata
    {
      method: 'GET',
      path: '/treasuries/:projectId/metadata',
      handler: 'treasury.getMetaInfoForProject'
    },
  ]
};
