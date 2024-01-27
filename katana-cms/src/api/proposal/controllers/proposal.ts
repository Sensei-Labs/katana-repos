'use strict';

/**
 * proposal controller
 */

import { factories } from '@strapi/strapi';
import dayjs from 'dayjs';

export default factories.createCoreController('api::proposal.proposal', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state?.user;
    const { data: payload } = ctx.request.body;

    if (!user) return ctx.badRequest('Please insert a token.');
    const twoDaysFromNow = dayjs().add(2, 'days').format();

    try {
      await strapi.entityService.create('api::proposal.proposal', {
        data: { status: 'voting', approvalQuorum: 25, deadline: twoDaysFromNow, votesCount: 0, ...payload }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }

    return { message: 'Proposal created.' };
  },
  async updateProposal(ctx) {
    const { id } = ctx.request.params;

    try {
      const proposal = await strapi.db.query('api::proposal.proposal').findOne({
        where: {
          id: {
            $eq: id
          }
        }
      });

      await strapi.service('api::proposal.proposal').update(id, { data: { votesCount: proposal.votesCount + 1 } });
    } catch (error) {
      console.log(error);
      throw error;
    }

    return { message: 'Proposal updated.' };
  }
}));
