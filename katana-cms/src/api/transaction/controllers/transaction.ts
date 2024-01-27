'use strict';

/**
 * transaction controller
 */
import { factories } from '@strapi/strapi';
import { formatTransactionsFromDB } from '../../../utils/format';
import { preCleanArrayTransactions } from '../utils';
import { BAD_REQUEST } from '../../../utils/error';

const { createCoreController } = factories;

module.exports = createCoreController('api::transaction.transaction', ({ strapi }) => ({
  async find(ctx) {
    const { project } = ctx.query;

    if (!project) return BAD_REQUEST('Please insert project param');

    ctx.query = {
      ...ctx.query,
      sort: ctx?.query?.sort ?? [{ date: 'desc' }, { id: 'asc' }],
      populate: '*',
      filters: {
        ...ctx.query.filters,
        treasury: {
          id: {
            $eq: project
          }
        }
      }
    };

    const { data, meta } = await super.find(ctx);

    const formatRawData = preCleanArrayTransactions(data);
    return { data: formatTransactionsFromDB(formatRawData, strapi), meta };
  },
  async findAllSenseiTransactions(ctx) {
    return await strapi.db.query('api::transaction.transaction').findMany({
      orderBy: [{ date: 'desc' }, { id: 'asc' }],
      populate: ['tag'],
      select: ['id', 'description', 'signature', 'idSolscan'],
      where: {
        tag: {
          id: {
            $null: false
          }
        },
        treasury: {
          id: {
            $eq: 1
          }
        }
      }
    });
  }
}));
