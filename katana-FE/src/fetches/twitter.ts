import { api } from '@/services/api';

export const completeTwitterAuth = async (code?: string) => {
  return await api.post(`/twitter/first-auth`, { code: code });
};
