// import path from 'path';
// import * as fs from 'fs/promises';
import { Strapi } from '@strapi/strapi';
import Utils from '../utils';

// const RESOLVE_ID_TAG = {
//   1: 2, // Development
//   2: 3, // Marketing
//   4: 1, // Royalties
//   5: 5, // Salary
//   6: 4 // Miscellaneous
// };

export async function resolveTransactionsFixed({ strapi }: { strapi: Strapi }) {
  if (process.env.APP_ENABLED_SET_SSL_TRANSACTIONS !== 'true') return;
  console.log('** Create transactions dev in prod **');

  // const allProjects = await strapi.entityService.findMany('api::treasury.treasury', {
  //   fields: ['id'],
  //   where: {
  //     status: 'active'
  //   }
  // });
  //
  // await Utils.asyncMap(allProjects, async (project) => {
  //   try {
  //     const transactionsForUpdate = [];
  //
  //     const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
  //       fields: ['id', 'toUserAccount', 'fromUserAccount', 'idSolscan', 'direction'],
  //       filters: {
  //         symbol: 'USDC',
  //         treasury: project.id
  //       }
  //     });
  //
  //     Utils.map(transactions, (transaction) => {
  //       if (transaction.toUserAccount === transaction.fromUserAccount && transaction.direction === 'OUT') {
  //         transactionsForUpdate.push({
  //           id: transaction.id,
  //           direction: 'IN'
  //         });
  //       }
  //     });
  //
  //     await Utils.asyncMap(transactionsForUpdate, async (transaction) => {
  //       await strapi.entityService.update('api::transaction.transaction', transaction.id, {
  //         data: {
  //           direction: transaction.direction
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // const pathResolver = path.resolve('public', 'ssl-transactions.json');
  // const data = (await strapi.controller('api::transaction.transaction').findAllSenseiTransactions({})) as any[];

  // if (data) {
  //   const formatData = data
  //     .filter((transaction) => transaction?.tag?.id !== 4)
  //     .map((transaction) => {
  //       const tagId = RESOLVE_ID_TAG[transaction.tag.id];
  //       return {
  //         signature: transaction.signature,
  //         idSolscan: transaction.idSolscan,
  //         description: transaction.description || '',
  //         tag: {
  //           connect: [
  //             {
  //               id: tagId
  //             }
  //           ]
  //         }
  //       };
  //     });
  //   try {
  //     await fs.writeFile(pathResolver, JSON.stringify(formatData), { encoding: 'utf8', flag: 'w' });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // try {
  //   const transactions = await fs.readFile(pathResolver, { encoding: 'utf8' });
  //   await Utils.asyncMap(JSON.parse(transactions.toString()), async (transaction) => {
  //     try {
  //       await strapi.db.query('api::transaction.transaction').update({
  //         where: { signature: transaction.signature, idSolscan: transaction.idSolscan },
  //         data: {
  //           tag: transaction.tag,
  //           description: transaction.description
  //         }
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  console.log('-- Finish create transactions dev in prod --');
}
