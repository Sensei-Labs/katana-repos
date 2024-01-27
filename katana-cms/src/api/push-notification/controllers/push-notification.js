'use strict';

/**
 * push-notification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::push-notification.push-notification', ({ strapi }) => ({
  async notifyAll(ctx) {
    const { body } = ctx.request;

    try {
      await strapi.service('api::push-notification.push-notification').notifyAllUsers({
        data: body
      });
      return { message: 'Ok' };
    } catch (e) {
      return { message: 'Error' };
    }
  },
  async find(ctx) {
    const userID = ctx.state?.user?.id;

    if (!userID) return ctx.badRequest('Please insert a UserID');

    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate
        ? ctx.query.populate
        : {
            question: {
              populate: {
                treasury: true
              }
            }
          },
      filters: {
        ...ctx.query.filters,
        $or: [
          {
            users: {
              id: {
                $in: [userID]
              }
            }
          },
          {
            users: {
              id: {
                $null: true
              }
            }
          }
        ]
      }
    };

    // Calling the default core action
    return await super.find(ctx);
  }
}));
