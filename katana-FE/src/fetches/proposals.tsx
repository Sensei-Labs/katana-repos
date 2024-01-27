import { AUTH_RESPONSE_SCOPE } from '@/config';
import { API_ROUTES } from '@/config/api';
import { api } from '@/services/api';

interface UserInfo {
  discordUserInfo: {
    email: string;
    id: string;
    username: string;
    verified: boolean;
  };
  jwt: string;
  user: {
    avatar: string;
  };
}

export function createProposal<T = any>(payload: {
  title: string;
  description: string;
  treasury: string;
}) {
  const userInfo: UserInfo = JSON.parse(
    localStorage.getItem(AUTH_RESPONSE_SCOPE) ?? ''
  );
  const path = `${API_ROUTES.CREATE_PROPOSAL.path}?userId=${userInfo?.discordUserInfo?.id}`;
  return api.post<T>(path, {
    data: payload
  });
}

export function updateProposal<T = any>(proposalId: string) {
  const path = `/proposals/update-proposal/${proposalId}`;
  return api.put<T>(path);
}

export enum SortEnum {
  NAME_ASC = 'title:asc',
  NAME_DESC = 'title:desc',
  VOTES_ASC = 'votes:asc',
  VOTES_DESC = 'votes:desc'
}
