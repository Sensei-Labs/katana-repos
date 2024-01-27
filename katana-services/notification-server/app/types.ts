import { FastifyInstance } from 'fastify';

export type FastifyInstanceWithAuth = FastifyInstance & {
  authenticate: (request: any, reply: any) => Promise<void>;
};
