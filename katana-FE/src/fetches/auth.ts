import { api } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { AxiosRequestConfig } from 'axios';

type UserPayload = {
  nickName?: string;
  email?: string;
  avatar?: string;
};

export function updateUser(
  userId: number,
  payload: UserPayload,
  config?: AxiosRequestConfig
) {
  const path = `${API_ROUTES.PLURAL_USERS.path}/${userId}`;

  return api.put(path, payload, config);
}

type DiscordToken = {
  discordToken: string;
};

export function addDiscordUser(
  userId: number,
  discordToken: DiscordToken,
  config?: AxiosRequestConfig
) {
  const path = `${API_ROUTES.PLURAL_USERS.path}/${userId}`;
  return api.put(path, discordToken, config);
}

type TwitterToken = {
  twitterToken: string;
};

export function addTwitterUser(
  userId: number,
  twitterToken: TwitterToken,
  config?: AxiosRequestConfig
) {
  const path = `${API_ROUTES.PLURAL_USERS.path}/${userId}`;

  return api.put(path, twitterToken, config);
}
