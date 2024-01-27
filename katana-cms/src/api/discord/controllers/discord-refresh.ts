import { discordApi } from '../../../services/fetch';

const client_id = process.env.PUBLIC_DISCORD_CLIENT_ID;
const client_secret = process.env.DISCORD_CLIENT_SECRET;

export default {
  refreshToken: async (ctx, next) => {
    const userObj: StrapiUser = ctx.state?.user;

    try {
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userObj.id, {
        fields: ['discordToken'],
        populate: { category: true }
      });

      const response = await discordApi({
        url: '/oauth2/token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'post',
        data: {
          client_id,
          client_secret,
          grant_type: 'refresh_token',
          refresh_token: user.discordToken
        }
      });

      await strapi.entityService.update('plugin::users-permissions.user', userObj.id, {
        data: { discordToken: response.data.refresh_token }
      });

      const response2 = await discordApi.get('/users/@me', {
        headers: { Authorization: `Bearer ${response.data.access_token}` }
      });

      await strapi.entityService.update('plugin::users-permissions.user', user?.id, {
        data: { discordUsername: response2.data.username, discordEmail: response2.data.email }
      });

      ctx.body = response.data;
    } catch (err) {
      ctx.body = err.response.data;
    }
  }
};
