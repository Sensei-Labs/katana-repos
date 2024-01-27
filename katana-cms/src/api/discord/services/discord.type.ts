import {
  DiscordAccessTokenResults,
  DiscordCurrentUser,
  DiscordGuildMemberInfo,
  DiscordGuildPartialInfo,
  DiscordServerRole
} from '../types';
import { AxiosResponse } from 'axios';

export interface DiscordServiceType {
  getDiscordUserInfo(accessToken: string): Promise<AxiosResponse<DiscordCurrentUser>>;

  getDiscordGuilds(accessToken: string): Promise<AxiosResponse<DiscordGuildPartialInfo[]>>;

  getDiscordServerRoles(serverId: string): Promise<AxiosResponse<DiscordServerRole[]>>;

  getDiscordKatanaServerRoles(): Promise<AxiosResponse<DiscordServerRole[]>>;

  getDiscordKatanaMemberInfo(userId: string): Promise<AxiosResponse<DiscordGuildMemberInfo>>;

  simpleDiscordLogin(code: string): Promise<AxiosResponse<DiscordAccessTokenResults>>;
}
