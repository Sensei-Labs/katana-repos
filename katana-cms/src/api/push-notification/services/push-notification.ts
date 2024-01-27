/**
 * push-notification service
 */
import Utils from '../../../utils';

import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

export default createCoreService('api::push-notification.push-notification', ({ strapi }) => ({
  async create(ctx) {
    const { data: payload } = ctx;
    // some logic here
    const result = await strapi.entityService.create('api::push-notification.push-notification', {
      populate: '*',
      data: payload
    });

    await Utils.asyncMap(result?.users || [], async (user) => {
      if (user?.walletAddress) {
        delete payload.users;
        return (strapi as any).pushNotificationService.pushNotification(user.walletAddress, {
          title: payload.title,
          content: payload.body,
          type: payload.type,
          question: payload?.question,
          treasury: payload?.treasury,
          link: payload?.link
        });
      }
    });

    return result;
  },
  async notifyAllUsers({ data: payload }) {
    await strapi.entityService.create('api::push-notification.push-notification', {
      data: payload
    });

    try {
      return (strapi as any).pushNotificationService.pushNotificationAllUsers({
        title: payload.title,
        content: payload.body,
        type: payload.type,
        question: payload?.question,
        treasury: payload?.treasury,
        link: payload?.link
      });
    } catch (error) {
      console.log('Error to send notification', error);
      throw error;
    }
  }
}));
