import { discordApi } from '../../../services/fetch';
import {
  getAllTreasuries,
  getOrCreateClient,
  getTreasuriesCanBeRead,
  getTreasuriesFromCreator,
  getTreasuryCanBeWrite,
  updateTreasuriesInUser
} from '../../auth/utils';
import { mergeScope } from '../../auth/utils/mergeScope';

const client_id = process.env.PUBLIC_DISCORD_CLIENT_ID;
const client_secret = process.env.DISCORD_CLIENT_SECRET;
const redirect_uri = process.env.PUBLIC_DISCORD_REDIRECT_URI;
const bot_token = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN;
const KATANA_GUILD_ID = '945960787984396309';
const reqRoles = ['945962647143211068', '945963242889576459', '945963317963415602', '945963521705934848'];

const getScope = async (tokens: any, walletAddress: string) => {
  const hasSenseiToken = true;
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
  loginDiscord: async (ctx, next) => {
    const { code, walletAddress, tokens } = ctx.request.body;

    try {
      const response = await discordApi({
        url: '/oauth2/token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'post',
        data: {
          code,
          client_id,
          client_secret,
          redirect_uri,
          grant_type: 'authorization_code'
        }
      });

      const discordInfo = await discordApi.get('/users/@me', {
        headers: { Authorization: `Bearer ${response.data.access_token}` }
      });

      const guildMember = await discordApi.get(`/guilds/${KATANA_GUILD_ID}/members/${discordInfo.data.id}`, {
        headers: { Authorization: `Bot ${bot_token}` }
      });

      const hasReqRoles = guildMember.data.roles.some((role) => reqRoles.includes(role));

      if (hasReqRoles) {
        const { code, message, errors, user } = await getOrCreateClient(strapi, walletAddress);
        if (errors) {
          return {
            code,
            message,
            result: null
          };
        }

        await strapi.entityService.update('plugin::users-permissions.user', user?.id, {
          data: { discordUsername: discordInfo.data.username, discordEmail: discordInfo.data.email }
        });

        let resScope = await getScope(tokens, walletAddress);

        const { recall } = await updateTreasuriesInUser({ user, scope: resScope.scope, strapi });

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
      if (!hasReqRoles) {
        return {
          code: 401,
          message: "You're not able to sign up or login without a Discord role",
          result: null
        };
      }

      ctx.body = response.data;
    } catch (err) {
      ctx.body = err.response.data;
    }
  }
};
