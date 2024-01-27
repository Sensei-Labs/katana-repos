import { API_ROUTES } from '@/config/api';
import { api } from '@/services/api';

export const completeDiscordAuth = async (code?: string) => {
  return await api.post('/discord/first-auth', { code: code });
};
