'use strict';

/**
 * treasury controller
 */
import { factories } from '@strapi/strapi';
import Utils from '../../../utils';
import { BAD_REQUEST, NOT_FOUND } from '../../../utils/error';
import { isValidTransactionType } from '../utils';
import { getNftFromAddressesInCache } from '../../../stores/nfts/actions';
import { getCollectionsInfoFromCache } from '../../../stores/collections/actions';
import { getOrCreateClient } from '../../auth/utils';
import { formatStringToBoolean, formatTransactionsFromDB } from '../../../utils/format';
import { CurrencyEnum, TypeReturnEnum } from '../../../../@types/currencyEnums';
import { STATUS_ENUM } from '../../../config';
import { getSplTokensForProject } from '../../../services/splTokens';
import { TIME_FILTER_TRANSACTION } from '../../transaction/types';
import { isValidTimeFilter } from '../../transaction/utils/graphics';
import { getStatisticForProject } from '../../../services/statistic';
import { getProjectWorker } from '../../../services/project';

const { createCoreController } = factories;

export default createCoreController('api::treasury.treasury', ({ strapi }: any) => ({
  async getTreasuriesForUI(ctx) {
    const { query } = ctx;
    const user = ctx?.state?.user;
    if (!user) return BAD_REQUEST('Insert a token bearer');

    query.populate = ['thumbnail', 'frontPage', 'collection_nfts_addresses', 'tags'];
    query.filters = {
      ...query.filters,
      access: {
        id: [user.id]
      },
      status: STATUS_ENUM.ACTIVE
    };

    // @ts-ignore
    const { pagination, results } = await strapi.service('api::treasury.treasury').find(query);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, { pagination });
  },
  async getCollectionsInfo(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    query.populate = ['collection_nfts_addresses'];

    const entity = await strapi.service('api::treasury.treasury').findOne(id, query);
    if (!entity) {
      return ctx.notFound('Notification not found');
    }

    const data = await getCollectionsInfoFromCache(id);

    return await this.sanitizeOutput(data, ctx);
  },
  async addAcceptedCollectionAddress(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data?.acceptedCollectionAddress) {
      return ctx.badRequest('acceptedCollectionAddress is missing');
    }

    const { query } = ctx;

    const entity = await strapi.service('api::treasury.treasury').findOne(id, query);

    const acceptedCollectionAddresses = Utils.addNewRecordToArray(
      data.acceptedCollectionAddress,
      entity.acceptedCollectionAddress
    );

    if (!acceptedCollectionAddresses) {
      return ctx.badRequest('Address already exists');
    }

    const updateEntity = await strapi.service('api::treasury.treasury').update(id, {
      data: {
        acceptedCollectionAddress: acceptedCollectionAddresses
      }
    });

    return await this.sanitizeOutput(updateEntity, ctx);
  },
  async deleteAcceptedCollectionAddress(ctx) {
    const { id, acceptedCollectionAddress } = ctx.params;

    const { query } = ctx;

    const entity = await strapi.service('api::treasury.treasury').findOne(id, query);

    const acceptedCollectionAddresses =
      entity.acceptedCollectionAddress?.filter((item) => item !== acceptedCollectionAddress) || [];

    const updateEntity = await strapi.service('api::treasury.treasury').update(id, {
      data: {
        acceptedCollectionAddress: acceptedCollectionAddresses
      }
    });

    return await this.sanitizeOutput(updateEntity, ctx);
  },
  async addAddressCanBeWrite(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    const { user, errors, message } = await getOrCreateClient(strapi, data.address);

    if (errors) {
      return ctx.notFound(message);
    }

    const treasury = await strapi.service('api::treasury.treasury').findOne(id, {
      populate: {
        canBeWrite: true
      }
    });

    if (!treasury) return ctx.notFound('Project not found');

    const canBeWrite = Utils.addNewRecordToArray(
      user.id,
      treasury?.canBeWrite?.map((item) => item.id)
    );

    if (!canBeWrite) return ctx.badRequest('Wallet already exists');

    const updateEntity = await strapi.service('api::treasury.treasury').update(id, {
      data: {
        canBeWrite: canBeWrite
      }
    });

    return await this.sanitizeOutput(updateEntity, ctx);
  },
  async addTreasuryAddress(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data?.id) return ctx.badRequest('Please send id in payload data');

    const treasury = await strapi.service('api::treasury.treasury').findOne(id, {
      populate: {
        treasuryAddresses: true
      }
    });

    if (!treasury) return ctx.notFound('Project not found');

    const treasuryAddresses = Utils.addNewRecordToArray(
      data.id,
      treasury?.treasuryAddresses?.map((item) => item.id)
    );

    if (!treasuryAddresses) return ctx.badRequest('Wallet already exists');

    const updateEntity = await strapi.service('api::treasury.treasury').update(id, {
      data: {
        treasuryAddresses: treasuryAddresses
      }
    });

    return await this.sanitizeOutput(updateEntity, ctx);
  },
  async updateTransactionsForProject(ctx) {
    const { projectId } = ctx.params;
    await strapi.service('api::treasury.treasury').updateTransactionsForProject({ projectId });
    await strapi.service('api::treasury.treasury').createStatisticAmountForProject({ projectId });
    await strapi.service('api::treasury.treasury').createStatisticCategoryForProject({ projectId });

    return {
      message: 'Completed'
    };
  },
  async allTransactionsForProject(ctx) {
    const { projectId } = ctx.params;

    const transactions = await strapi.service('api::transaction.transaction').getAllTransactionsForProject({ projectId });

    return formatTransactionsFromDB(transactions, strapi, TypeReturnEnum.SIMPLE);
  },
  async allNFTsForProject(ctx) {
    const { projectId } = ctx.params;

    const project = await strapi.entityService.findOne('api::treasury.treasury', projectId, {
      populate: ['treasuryAddresses']
    });

    if (!project) {
      throw new NOT_FOUND('Project not found');
    }

    const collections = await getNftFromAddressesInCache(
      project.id,
      project?.treasuryAddresses,
      project?.acceptedCollectionAddress
    );

    const { getAmountFromPrice } = strapi.princingServer;

    return collections.map((collection) => {
      return {
        ...collection,
        tokens: collection.tokens.map((token) => {
          return {
            ...token,
            marketInfo: token.marketInfo
              ? {
                  ...token.marketInfo,
                  priceUsd: getAmountFromPrice(CurrencyEnum.SOL, token.marketInfo?.priceSol)
                }
              : null
          };
        })
      };
    });
  },
  async getSPLTransactions(ctx) {
    const project = await strapi.entityService.findOne('api::treasury.treasury', ctx.params.projectId, {
      populate: ['treasuryAddresses']
    });

    if (!project) {
      throw new NOT_FOUND('Project not found');
    }

    const { data } = await getSplTokensForProject(project?.id);

    return data?.tokens || [];
  },
  async getMetaInfoForProject(ctx) {
    const { data } = await getProjectWorker(ctx.params.projectId);
    return data;
  },
  async statisticAmountForProject(ctx) {
    const { projectId } = ctx.params;
    const { filters } = ctx.query;
    if (!isValidTransactionType(filters?.transactionType)) {
      throw new BAD_REQUEST('Please send valid transaction type');
    }

    const isValidFilter = isValidTimeFilter(filters?.time || '');

    if (!isValidFilter && filters?.time) throw new BAD_REQUEST('Please send time valid filter');

    const data = await getStatisticForProject({
      projectId,
      type: 'line',
      showRoyalties: formatStringToBoolean(filters?.showRoyalties || false),
      time: filters?.time || TIME_FILTER_TRANSACTION.ONE_DAY,
      transactionType: filters?.transactionType
    });

    console.log(data);
    return data;
  },
  async statisticCategoryForProject(ctx) {
    const { projectId } = ctx.params;
    const { filters } = ctx.query;
    const isValidFilter = isValidTimeFilter(filters?.time || '');

    if (!isValidTransactionType(filters?.transactionType)) {
      throw new BAD_REQUEST('Please send valid transaction type');
    }
    if (!isValidFilter && filters?.time) throw new BAD_REQUEST('Please send time valid filter');

    return getStatisticForProject({
      projectId,
      type: 'pie',
      showRoyalties: formatStringToBoolean(filters?.showRoyalties || false),
      time: filters?.time || TIME_FILTER_TRANSACTION.ONE_DAY,
      transactionType: filters?.transactionType
    });
  },
  async createStatisticAmountForProject(ctx) {
    const { projectId } = ctx.params;

    return strapi.service('api::treasury.treasury').createStatisticAmountForProject({ projectId });
  },
  async createStatisticCategoryForProject(ctx) {
    const { projectId } = ctx.params;

    return strapi.service('api::treasury.treasury').createStatisticCategoryForProject({ projectId });
  }
}));
