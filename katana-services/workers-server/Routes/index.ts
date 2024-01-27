import { FastifyInstance } from 'fastify';
import TokenRoutes from '../Modules/Token/Routes/Token.route';
import ProjectRoutes from '../Modules/Project/Routes/Project.route';
import StatisticRoutes from '../Modules/Statistic/Routes/Statistic.route';

export default (fastify: FastifyInstance, opts, done) => {
  // modules routes here
  fastify.register(TokenRoutes, { prefix: '/tokens' });
  fastify.register(ProjectRoutes, { prefix: '/projects' });
  fastify.register(StatisticRoutes, { prefix: '/statistics' });

  done();
};
