import { FastifyInstance } from 'fastify';
import { registerPieGraphic, registerLineGraphic } from '../Controllers/Statistic.controller';
import {
  statisticPieSchemaValidation,
  statisticLineSchemaValidation,
} from '../Models/Statistic.schema';
import { ApplySchemas } from '../../../Utils/schemas';

export default function StatisticRoutes(fastify: FastifyInstance, opts, done) {
  // schemas
  ApplySchemas(fastify, [statisticPieSchemaValidation, statisticLineSchemaValidation]);

  // endpoints
  fastify.post('/:treasuryId/register-pie-data', {
    handler: registerPieGraphic,
    schema: {
      body: {
        $ref: statisticPieSchemaValidation.$id,
      },
    },
  });
  fastify.post('/:treasuryId/register-line-data', {
    handler: registerLineGraphic,
    schema: {
      body: {
        $ref: statisticLineSchemaValidation.$id,
      },
    },
  });

  done();
}
