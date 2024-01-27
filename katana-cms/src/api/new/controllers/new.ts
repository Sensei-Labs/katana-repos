/**
 * new controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::new.new', ({ strapi }) => {
  return {
    async finAllForProject(ctx) {
      const { projectId } = ctx.params;

      if (!projectId) throw new Error('Project id not found in query params');

      ctx.query.filters = {
        ...ctx.query.filters,
        project: projectId
      };

      // Calling the default core action
      const { results, pagination } =  await strapi.service('api::new.new').find(ctx) as any;
      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      return this.transformResponse(sanitizedResults, { pagination });
    },
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) throw new Error('User not found');
      console.log(ctx.request.body);

      ctx.request.body.data = {
        ...ctx.request.body.data,
        author: user.id
      };

      // Calling the default core action
      return await super.create(ctx);
    }
  };
});
