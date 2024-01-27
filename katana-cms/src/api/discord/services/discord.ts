import { AxiosResponse } from 'axios';
import { discordApi } from '../../../services/fetch';

import {
  DiscordAccessTokenResults,
  DiscordCurrentUser,
  DiscordGuildMemberInfo,
  DiscordGuildPartialInfo,
  DiscordServerRole
} from '../types';
import { PROJECT_GUILD_ID, bot_token, discord_client_id, discord_client_secret, discord_redirect_uri } from '../utils';
import { DiscordServiceType } from './discord.type';

export class DiscordService implements DiscordServiceType {
  private XRateLimitBucket: string = '';

  async getDiscordUserInfo(accessToken: string) {
    const response = await discordApi.get<null, AxiosResponse<DiscordCurrentUser>>('/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response?.data?.id) {
      this.XRateLimitBucket = response?.data.id;
    }

    return response;
  }

  async getDiscordServerRoles(serverId: string) {
    // The bot might need to be inside the server
    return await discordApi.get<null, AxiosResponse<DiscordServerRole[]>>(`/guilds/${serverId}/roles`, {
      headers: { Authorization: `Bot ${bot_token}`, 'X-RateLimit-Bucket': this.XRateLimitBucket }
    });
  }

  async getDiscordKatanaServerRoles() {
    return await discordApi.get<null, AxiosResponse<DiscordServerRole[]>>(`/guilds/${PROJECT_GUILD_ID}/roles`, {
      headers: { Authorization: `Bot ${bot_token}`, 'X-RateLimit-Bucket': this.XRateLimitBucket }
    });
  }

  async getDiscordKatanaMemberInfo(userId: string) {
    return await discordApi.get<null, AxiosResponse<DiscordGuildMemberInfo>>(
      `/guilds/${PROJECT_GUILD_ID}/members/${userId}`,
      {
        headers: { Authorization: `Bot ${bot_token}`, 'X-RateLimit-Bucket': this.XRateLimitBucket }
      }
    );
  }

  async getDiscordGuilds(accessToken: string) {
    return await discordApi.get<null, AxiosResponse<DiscordGuildPartialInfo[]>>(`/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'X-RateLimit-Bucket': this.XRateLimitBucket }
    });
  }

  async getDiscordGuildRoles(projectId: string, accessToken: string) {
    return await discordApi.get<null, AxiosResponse<{ roles: string[] }>>(`/users/@me/guilds/${projectId}/member`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'X-RateLimit-Bucket': this.XRateLimitBucket }
    });
  }

  async simpleDiscordLogin(code: string) {
    return await discordApi<null, AxiosResponse<DiscordAccessTokenResults>>({
      url: '/oauth2/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'post',
      data: {
        code,
        client_id: discord_client_id,
        client_secret: discord_client_secret,
        redirect_uri: discord_redirect_uri,
        grant_type: 'authorization_code'
      }
    });
  }
}

export default new DiscordService();
