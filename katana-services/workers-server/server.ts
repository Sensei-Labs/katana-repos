import 'dotenv/config';
import fastifyServer from 'fastify';
import initDatabase from './Config/Database';
import AppRoutes from './Routes';
import { VerifyAndSaveProjects } from './Workers';
import { APP_DISABLED_WORKER, APP_ENABLED_LOGGER } from './Config/env';

// get instance of fastify server
const server = fastifyServer({
  logger: APP_ENABLED_LOGGER,
});

// Init database configuration with fastify
initDatabase();

server.get('/ping', async () => 'pong');

// set v1 routes
server.register(AppRoutes, { prefix: '/v1' });

// run workers
if (APP_DISABLED_WORKER) {
  console.log('Worker is disabled');
} else {
  VerifyAndSaveProjects().then();
}

// initial server
server
  .listen({
    port: Number(process.env.PORT || 8080),
    host: '0.0.0.0',
  })
  .catch(console.log)
  .then((address) => {
    console.log(`Server listening at ${address}`);
  });
