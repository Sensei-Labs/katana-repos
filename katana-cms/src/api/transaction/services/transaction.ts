'use strict';

/**
 * transaction service
 */

import { factories } from '@strapi/strapi';

import { getTransactionsInfoFromCache } from '../../../stores/transactions/actions';
import {TreasuryAccountType} from "../../treasury-address/types";

const { createCoreService } = factories;

export default createCoreService('api::transaction.transaction', ({ strapi }) => ({
  async getAllTransactionsForProject({ projectId }) {
    return strapi.entityService.findMany('api::transaction.transaction', {
      populate: ['tag', 'walletAddressTrack'],
      filters: {
        treasury: projectId
      }
    });
  },
  // using in worker
  async getAllTransactionsCacheForProject({
    projectId,
    treasuryAddresses,
    findInCache
  }: {
    projectId: number;
    findInCache: boolean;
    treasuryAddresses: TreasuryAccountType[];
  }) {
    return await getTransactionsInfoFromCache({
      strapi,
      projectId,
      accountAddresses: treasuryAddresses,
      findInCache
    });
  }
}));
