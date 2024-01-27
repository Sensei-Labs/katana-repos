import { FastifyInstance } from 'fastify';
import {
  getAll,
  getById,
  updateProject,
  updateSplTokensForProject,
} from '../Controllers/Project.controller';
import { projectSchemaValidation } from '../Models/Project.schema';
import { ApplySchemas } from '../../../Utils/schemas';

export default function TokenRoutes(fastify: FastifyInstance, opts, done) {
  // schemas
  ApplySchemas(fastify, [projectSchemaValidation]);

  // endpoints
  fastify.get('/', getAll);
  fastify.get('/:treasuryId', getById);
  fastify.put('/:treasuryId', updateProject);
  fastify.put('/:treasuryId/update-spl-tokens', updateSplTokensForProject);

  done();
}
