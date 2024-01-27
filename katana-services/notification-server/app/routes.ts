import {
  createNotificationForAllUsers,
  createNotificationForWallet,
} from './index';
import { FastifyInstanceWithAuth } from './types';
import validateJwt from './middleware';

const payloadSchema = {
  $id: 'notificationBody',
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    question: { type: 'number' },
    treasury: { type: 'number' },
    link: { type: 'string' },
  },
  required: ['title', 'content'],
};

const headersJsonSchema = {
  type: 'object',
  properties: {
    authorization: { type: 'string' },
  },
  required: ['authorization'],
};

export default function createRoutes(fastify: FastifyInstanceWithAuth) {
  fastify.addSchema(payloadSchema);

  fastify.get('/ping', async () => 'pong');

  fastify.post(
    '/api/send-message',
    {
      preHandler: validateJwt,
      schema: {
        body: { $ref: 'notificationBody' },
        headers: headersJsonSchema,
      },
    },
    async (request, reply) => {
      const body = request.body as any;

      await createNotificationForAllUsers(body);

      return reply.send({ status: 'ok' });
    },
  );

  fastify.post<{
    Params: {
      walletAddress: string;
    };
  }>(
    '/api/send-message/:walletAddress',
    {
      preHandler: validateJwt,
      schema: {
        body: { $ref: 'notificationBody' },
        headers: headersJsonSchema,
      },
    },
    async (request, reply) => {
      const { walletAddress } = request.params;
      const body = request.body as any;

      await createNotificationForWallet(walletAddress, body);

      return reply.send({ status: 'ok' });
    },
  );
}
