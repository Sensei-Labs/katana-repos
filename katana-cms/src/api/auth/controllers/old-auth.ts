'use strict';

/**
 * A set of functions called "actions" for `auth`
 */

import {
  getOrCreateClient,
  getTreasuriesCanBeRead,
  getTreasuryCanBeWrite,
  verifySenseiToken,
  getTreasuriesFromCreator,
  getAllTreasuries,
  updateTreasuriesInUser
} from '../utils';
import { mergeScope } from '../utils/mergeScope';

const getScope = async (tokens: any, walletAddress: string) => {
  const hasSenseiToken = verifySenseiToken(tokens);
  const allTreasuriesDB = await getAllTreasuries(strapi);

  const treasuryCreators = getTreasuriesFromCreator(allTreasuriesDB, walletAddress);
  const treasuryCanBeWrite = getTreasuryCanBeWrite(allTreasuriesDB, walletAddress);
  const treasuryCanBeRead = getTreasuriesCanBeRead(allTreasuriesDB, tokens, hasSenseiToken);

  const scope = mergeScope({ treasuryCreators, treasuryCanBeWrite, treasuryCanBeRead });

  return {
    scope,
    hasSenseiToken
  };
};

export default {
  ping() {
    return { message: 'Ok' };
  },
  async auth(ctx) {
    const { tokens, walletAddress } = ctx.request.body;

    const { code, message, errors, user } = await getOrCreateClient(strapi, walletAddress);

    if (errors) {
      return {
        code,
        message,
        result: null
      };
    }

    let resScope = await getScope(tokens, walletAddress);
    const { recall } = await updateTreasuriesInUser({ user, scope: resScope.scope, strapi });

    // recall actions for get data updated
    if (recall) {
      const scope = await getScope(tokens, walletAddress);
      resScope.scope = scope.scope;
      resScope.hasSenseiToken = scope.hasSenseiToken;
    }

    return {
      code,
      message,
      result: {
        scope: resScope.scope,
        hasSenseiToken: resScope.hasSenseiToken,
        hasAccess: Boolean(resScope.hasSenseiToken || resScope.scope.length)
      }
    };
  }
};
