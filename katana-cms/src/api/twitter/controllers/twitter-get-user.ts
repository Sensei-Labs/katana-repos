import { twitterApi } from '../../../services/fetch';

export default {
  getUser: async (ctx, next) => {
    const { access_token } = ctx.request.query;

    try {
      const response = await twitterApi.get(`/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      ctx.body = response.data;
    } catch (err) {
      ctx.body = err.response.data;
    }
  }
};
