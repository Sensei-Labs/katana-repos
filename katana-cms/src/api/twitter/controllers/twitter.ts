import { twitterApi } from '../../../services/fetch';

const client_id = process.env.TWITTER_CLIENT_ID;
const client_secret = process.env.TWITTER_CLIENT_SECRET;
const redirect_uri = process.env.TWITTER_REDIRECT_URI;

export default {
  firstAuth: async (ctx, next) => {
    const { code } = ctx.request.body;
    const user: StrapiUser = ctx.state?.user;

    const request_body = {
      code,
      client_id,
      redirect_uri,
      grant_type: 'authorization_code',
      code_verifier: 'challenge'
    };

    const headers = {
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
      const response = await twitterApi({
        url: '/oauth2/token',
        headers,
        method: 'post',
        data: request_body
      });

      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: { twitterToken: response.data.refresh_token }
      });

      ctx.body = response.data;
    } catch (err) {
      ctx.body = err.response.data;
    }
  }
};
