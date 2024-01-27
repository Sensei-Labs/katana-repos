import Queue from 'better-queue';
import { Strapi } from '@strapi/strapi';

import Utils from '../utils';

const ONE_MINUTE = 1000 * 60;

export function updateTransactions({ strapi }: { strapi: Strapi }) {
  let queueProcess = false;
  const intervalInMinutes = Number(process.env.APP_WORKER_TRANSACTIONS_INTERVAL || 60);

  const createQueue = new Queue(async function (input, cb) {
    if (Array.isArray(input)) {
      queueProcess = true;

      await Utils.asyncMap(input, async ({ id: projectId }) => {
        try {
          await strapi.service('api::treasury.treasury').updateTransactionsForProject({ projectId });
          await strapi.service('api::treasury.treasury').createStatisticAmountForProject({ projectId });
          await strapi.service('api::treasury.treasury').createStatisticCategoryForProject({ projectId });

          console.log(`Finish update transactions for project ID: ${projectId}`);
        } catch (e) {
          console.log(e);
        }
      });

      queueProcess = false;
    }

    cb(input);
  });

  setInterval(async () => {
    try {
      console.log(`Transactions worker running every: ${intervalInMinutes} Minutes`);

      if (queueProcess) {
        throw new Error(
          'Job in process, canceling new requested from queue, up the interval time in Bootstrap in src/index.ts'
        );
      }

      const allProjects = await strapi.entityService.findMany('api::treasury.treasury', {
        fields: ['id']
      });
      createQueue.push(allProjects);
    } catch (e) {
      console.log(e?.message | e);
    }
  }, ONE_MINUTE * intervalInMinutes);
}
