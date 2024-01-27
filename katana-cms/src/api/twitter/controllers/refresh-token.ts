import { twitterApi } from '../../../services/fetch';

const client_id = process.env.TWITTER_CLIENT_ID;
const client_secret = process.env.TWITTER_CLIENT_SECRET;

export default {
  refreshToken: async (ctx, next) => {
    const userObj: StrapiUser = ctx.state?.user;

    try {
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userObj.id, {
        fields: ['twitterToken'],
        populate: { category: true }
      });

      const response = await twitterApi({
        url: '/oauth2/token',
        headers: {
          Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data: {
          client_id,
          grant_type: 'refresh_token',
          refresh_token: user.twitterToken
        }
      });

      await strapi.entityService.update('plugin::users-permissions.user', userObj.id, {
        data: { twitterToken: response.data.refresh_token }
      });

      ctx.body = response.data;
    } catch (err) {
      ctx.body = err.response.data;
    }
  }
};
