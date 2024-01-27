'use strict';

/**
 * question controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::question.question', ({ strapi }) => ({
  async findOne(ctx) {
    ctx.query.populate = {
      ...ctx.query?.populate,
      answers: {
        populate: {
          by: {
            fields: ['id', 'walletAddress']
          }
        }
      },
      by: {
        fields: ['id', 'walletAddress']
      }
    };

    return await super.findOne(ctx);
  },
  async find(ctx) {
    const { project } = ctx.query;
    if (!project) return ctx.badRequest('Please insert a project param');

    ctx.populate = {
      ...ctx.populate,
      by: {
        fields: ['id', 'walletAddress']
      }
    };
    ctx.filters = {
      ...ctx.filters,
      treasury: project
    };

    const { results, pagination } =  await strapi.service('api::question.question').find(ctx);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, { pagination });

    // return await super.find(ctx);
  },
  async create(ctx) {
    const user = ctx.state?.user;
    const { data: payload } = ctx.request.body;
    if (!user) return ctx.badRequest('Please insert a bearer token');
    if (!payload?.treasury) return ctx.badRequest('Please insert a treasury ID');

    const { id: userId } = user;

    payload.by = userId;

    const newQuestion = await strapi.entityService.create('api::question.question', {
      data: payload,
      populate: {
        treasury: {
          populate: {
            creator: true,
            canBeWrite: true
          }
        },
        by: true
      }
    });

    const project = newQuestion.treasury;

    try {
      const allUsersIds = [];

      // add id from creator
      if (project?.creator) {
        if (!allUsersIds.includes(project.creator.id) && project.creator.id !== userId) {
          allUsersIds.push(project.creator.id);
        }
      }

      // add id from admins
      project.canBeWrite.forEach((admin) => {
        if (!allUsersIds.includes(admin.id) && admin.id !== userId) {
          allUsersIds.push(admin.id);
        }
      });

      const payloadForNotification = {
        title: newQuestion.title,
        body: newQuestion.content,
        date: newQuestion.createdAt,
        question: newQuestion.id,
        treasury: project?.id,
        users: allUsersIds,
        type: 'question'
      };

      await strapi.service('api::push-notification.push-notification').create({
        data: payloadForNotification
      });
    } catch (err) {
      console.log(`Error send notification`, err);
    }

    newQuestion.by = {
      walletAddress: newQuestion?.by?.walletAddress || ''
    };
    return newQuestion;
  }
}));
