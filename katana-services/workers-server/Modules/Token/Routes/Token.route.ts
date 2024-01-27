import { FastifyInstance } from 'fastify';
import { findOrCreateByAddress, getAll } from '../Controllers/Token.controller';
import { collectionSchemaValidation, tokenSchemaValidation } from '../Models/Token.schema';
import { ApplySchemas } from '../../../Utils/schemas';

export default function TokenRoutes(fastify: FastifyInstance, opts, done) {
  // schemas
  ApplySchemas(fastify, [collectionSchemaValidation, tokenSchemaValidation]);

  // endpoints
  fastify.get('/', getAll);
  fastify.get('/get-metadata/:mintAddress', findOrCreateByAddress);
  // fastify.post('/', {
  //   handler: createToken,
  //   schema: {
  //     body: {
  //       $ref: tokenSchemaValidation.$id,
  //     },
  //   },
  // });

  done();
}
