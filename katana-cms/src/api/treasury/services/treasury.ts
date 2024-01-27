'use strict';

/**
 * treasury service
 */

import { factories } from '@strapi/strapi';
import { formatTransactionsFromDB } from '../../../utils/format';
import { TypeReturnEnum } from '../../../../@types/currencyEnums';
import { setNewBalance, setStatisticAmountForProject, setStatisticCategoryForProject } from '../../../services/statistic';
import { STATUS_ENUM } from '../../../config';
import { NOT_FOUND } from '../../../utils/error';
import { createTransactionsInDB, mergeTransactions } from '../utils';

export default factories.createCoreService('api::treasury.treasury', ({ strapi }) => ({
  async createStatisticAmountForProject({ projectId }: { projectId: number }) {
    const transactions = await strapi.service('api::transaction.transaction').getAllTransactionsForProject({ projectId });
    const allTransactionsFormat = formatTransactionsFromDB(transactions, strapi, TypeReturnEnum.SIMPLE);

    const data = await setStatisticAmountForProject(projectId, allTransactionsFormat);
    await setNewBalance(projectId, allTransactionsFormat);

    return data;
  },
  async createStatisticCategoryForProject({ projectId }: { projectId: number }) {
    const transactions = await strapi.service('api::transaction.transaction').getAllTransactionsForProject({ projectId });
    const allTransactionsFormat = formatTransactionsFromDB(transactions, strapi, TypeReturnEnum.SIMPLE);

    const data = await setStatisticCategoryForProject(projectId, allTransactionsFormat);
    await setNewBalance(projectId, allTransactionsFormat);

    return data;
  },
  async updateTransactionsForProject({ projectId }: { projectId: number }) {
    console.log(`Updating transactions for projectID ${projectId}`);

    const project = await strapi.db.query('api::treasury.treasury').findOne({
      populate: ['treasuryAddresses'],
      where: {
        id: projectId,
        status: STATUS_ENUM.ACTIVE
      }
    });

    if (!project) {
      console.log('Project not found');
      throw new NOT_FOUND('Project not found');
    }

    const treasuryAddresses = project?.treasuryAddresses || [];

    const transactionsFromBlockChain = await strapi
      .service('api::transaction.transaction')
      .getAllTransactionsCacheForProject({ projectId, treasuryAddresses, findInCache: false });

    let transactionsFromDB = await strapi.db.query('api::transaction.transaction').findMany({
      // @ts-ignore
      populate: true,
      where: {
        treasury: projectId
      }
    });

    const { news } = await mergeTransactions(transactionsFromBlockChain, transactionsFromDB);
    console.log({ news: news.length });
    await createTransactionsInDB({ projectId, strapi, transactionsToCreate: news });

    console.log('--- Project transactions updated ---');

    return news;
  }
}));
