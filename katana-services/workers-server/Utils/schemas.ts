import { FastifyInstance } from 'fastify';

export function ApplySchemas(fastify: FastifyInstance, schemas: unknown[]) {
  schemas.forEach((schema) => fastify.addSchema(schema));
}
