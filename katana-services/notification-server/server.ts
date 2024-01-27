import 'dotenv/config';
import fastifyServer from 'fastify';
import websocketPlugin from '@fastify/websocket';

import createRoutes from './app/routes';
import runSocket from './app';
import { FastifyInstanceWithAuth } from './app/types';

const fastify = fastifyServer({
  logger: true,
});

// Add plugin to websocket
fastify.register(websocketPlugin);

// creating socket
fastify.register(async (server) => {
  server.get('/', { websocket: true }, async (connection) => {
    runSocket(connection);
  });
});

// creating routes
createRoutes(fastify as unknown as FastifyInstanceWithAuth);

// starting server
fastify.listen(Number(process.env.PORT || 8082), '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Notification server listening at ${address}`);
});
