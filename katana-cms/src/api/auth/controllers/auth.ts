'use strict';
/**
 * A set of functions called "actions" for `auth`
 */

import { updateTreasuriesInUser } from '../utils';
import NewDiscordAuth from '../services/newDiscordAuth';
import { BAD_REQUEST, NOT_FOUND } from '../../../utils/error';
import { getNewScope } from '../utils/scope';

type OutputAuthType = {
  isNew: boolean;
  result: {
    scope: any[];
    hasSenseiToken: boolean;
    hasAccess: boolean;
  };
  discordInfo: {
    id: string;
    email: string;
    username: string;
    verified: boolean;
  };
};

export default {
  ping() {
    return { message: 'Ok' };
  },
  async auth(ctx): Promise<OutputAuthType> {
    const { code } = ctx.request.body;

    let isNew = false;
    const discordService = new NewDiscordAuth(strapi, code);

    try {
      await discordService.getAccessToken();
    } catch (e) {
      console.log(e?.response);
      throw new BAD_REQUEST(`Invalid discord code: ${code}`);
    }

    const { user, hasSenseiToken } = await discordService.getDiscordUserInfo();

    let userDB = await discordService.getClientFromDB(user.email);

    if (!userDB) {
      try {
        userDB = await discordService.createUserInDB({
          email: user.email,
          password: `${user.id}-${user.email}`,
          username: user.username,
          discordId: user.id
        });
        isNew = true;
      } catch (e) {
        console.log('User not created ', e?.response?.data?.error || e);
        throw new NOT_FOUND('User not created, please retry later');
      }
    }

    let resScope = await getNewScope(user.email, discordService, hasSenseiToken);
    const { recall } = await updateTreasuriesInUser({ user: userDB, scope: resScope.scope, strapi });

    // recall actions for get data updated
    if (recall) {
      const scope = await getNewScope(user.email, discordService, hasSenseiToken);
      resScope.scope = scope.scope;
    }

    console.log(resScope.scope);

    return {
      isNew: isNew,
      result: {
        scope: resScope.scope,
        hasSenseiToken: hasSenseiToken,
        hasAccess:
          hasSenseiToken ||
          resScope.scope.some((treasury) => treasury.canBeRead || treasury.canBeWrite || treasury.isCreator)
      },
      discordInfo: {
        id: user.id,
        email: user.email,
        username: user.username,
        verified: user.verified
      }
    };
  }
};
