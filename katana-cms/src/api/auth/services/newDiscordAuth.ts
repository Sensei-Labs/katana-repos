import { Strapi } from '@strapi/strapi';
import { DiscordService } from '../../discord/services/discord';
import { DiscordGuildPartialInfo } from '../../discord/types';
import { sensei_token_roles } from '../../discord/utils';
import Utils from '../../../utils';
import { waitTime } from '../../../utils/waitTime';

export default class NewDiscordAuth {
  private discordService: DiscordService;

  private strapi: Strapi;

  private code: string;

  private accessToken: string;

  constructor(strapi: Strapi, code: string) {
    this.code = code;
    this.strapi = strapi;
    this.discordService = strapi.service('api::discord.discord') as unknown as DiscordService;
  }

  async getAccessToken() {
    const { data } = await this.discordService.simpleDiscordLogin(this.code);
    this.accessToken = data.access_token;
    return data.access_token;
  }

  async getClientFromDB(email: string): Promise<{ id: string; email: string }> {
    return this.strapi.db.query('plugin::users-permissions.user').findOne({
      select: ['id', 'email', 'username', 'discordId'],
      where: { email },
      populate: {
        // @ts-ignore
        treasuries: true
      }
    });
  }

  async createUserInDB(payload: { email: string; discordId: string; username: string; password: string }): Promise<{
    id: string;
    email: string;
  }> {
    const { data } = await Utils.fetchInstance.post('/api/auth/local/register', {
      role: 1,
      blocked: false,
      confirmed: true,
      provider: 'email',
      ...payload
    });
    return data;
  }

  async getDiscordUserInfo() {
    const { data: user } = await this.discordService.getDiscordUserInfo(this.accessToken);
    const { data: katanaMemberInfo } = await this.discordService.getDiscordKatanaMemberInfo(user?.id);

    const hasSenseiToken = katanaMemberInfo.roles.some((role) => sensei_token_roles.includes(role));

    return {
      user,
      katanaMemberInfo,
      hasSenseiToken
    };
  }

  async getDiscordGuilds() {
    try {
      const { data } = await this.discordService.getDiscordGuilds(this.accessToken);
      return data;
    } catch (e) {
      console.log('Error getDiscordGuilds >>', e);
      return [];
    }
  }

  async getDiscordRolesForGuildsInDB(guilds: DiscordGuildPartialInfo[]) {
    const roles: string[] = [];

    await Utils.asyncMap(guilds, async (guild) => {
      try {
        const { data } = await this.discordService.getDiscordGuildRoles(guild.id, this.accessToken);
        if (!!data?.roles?.length) {
          roles.push(...data.roles);
        }
        await waitTime(1);
      } catch (e) {
        console.log('Error getDiscordRolesForGuildsInDB >>', e);
      }
    });

    return roles;
  }
}
