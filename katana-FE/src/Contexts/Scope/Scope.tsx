import useSWR from 'swr';
import { useRouter } from 'next/router';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

import { api } from '@/services/api';
import { fetcher } from '@/services/api';

import { API_ROUTES } from '@/config/api';
import { AUTH_RESPONSE_SCOPE, AUTH_SPECIAL_INFO_KEY, ROUTES } from '@/config';

import {
  LoginDiscordInfoType,
  ScopeContextType,
  ServerResponseType,
  UserInfo
} from './types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import createAvatarForUser from '@/Contexts/Scope/createAvatarForUser';

const ScopeContext = createContext<ScopeContextType | null>(null);

export const ScopeProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const [completedUser, setCompletedUser] = useLocalStorage<{
    discordUserInfo: LoginDiscordInfoType;
    jwt: string;
    user: UserInfo | null;
  } | null>(AUTH_RESPONSE_SCOPE, null);

  const [specialInfo, setSpecialInfo] =
    useLocalStorage<ServerResponseType | null>(AUTH_SPECIAL_INFO_KEY, null);

  const [loginLoading, setLoginLoading] = useState(false);
  const [loadingDiscordAuth, setLoadingDiscordAuth] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const onLogout = useCallback(async () => {
    setCompletedUser(null);
    setInitLoading(false);
  }, [setCompletedUser]);

  const onLogin = useCallback(
    async (discordInfo: LoginDiscordInfoType) => {
      setLoadingDiscordAuth(false);

      if (!discordInfo) {
        setInitLoading(false);
        return setCompletedUser(null);
      }

      setLoginLoading(true);

      const { data: responseLogin } = await api.post<{
        jwt: string;
        user: UserInfo;
      }>(
        API_ROUTES.LOGIN.path,
        {
          identifier: discordInfo.email,
          password: `${discordInfo.id}-${discordInfo.email}`
        },
        { headers: { Authorization: '' } }
      );

      let dataLogin = responseLogin;

      if (!dataLogin?.user?.avatar) {
        await createAvatarForUser(discordInfo, dataLogin);
      }

      setCompletedUser((prevState) => ({
        jwt: dataLogin.jwt,
        user: dataLogin.user,
        discordUserInfo: prevState?.discordUserInfo || discordInfo
      }));

      setLoginLoading(false);
      setInitLoading(false);

      return router.push(ROUTES.TREASURIES.path);
    },
    [router, setCompletedUser]
  );

  const { data: userCommunity } = useSWR<UserInfo>(
    completedUser?.jwt && API_ROUTES.GET_USER.path,
    fetcher
  );

  const onLoginDiscordAndGetScopeInBackend = useCallback(
    async (code: string): Promise<LoginDiscordInfoType> => {
      setLoadingDiscordAuth(true);

      try {
        const { data } = await api.post<{
          discordInfo: LoginDiscordInfoType;
          result: null | ServerResponseType;
        }>(
          API_ROUTES.GET_OR_CREATE_CLIENT.path,
          { code },
          { headers: { Authorization: '' } }
        );

        if (!data?.result?.hasAccess) {
          throw new Error(
            'You need to join our community before you can log in, please make sure to join our Discord server and try again'
          );
        }

        setCompletedUser({
          discordUserInfo: data?.discordInfo,
          jwt: '',
          user: null
        });
        setSpecialInfo(data?.result ?? null);

        return data?.discordInfo;
      } catch (e) {
        console.log(e);
        await onLogout();
        throw e;
      } finally {
        setLoadingDiscordAuth(false);
      }
    },
    [onLogout, setCompletedUser, setSpecialInfo]
  );

  const scope = useMemo(() => {
    return specialInfo?.scope || [];
  }, [specialInfo?.scope]);

  const getScopeForProject = useCallback(
    (treasuryId: number) => {
      const findProject = scope.find((item) => item.id === treasuryId);

      return {
        isCreator: !!findProject?.isCreator,
        canBeWrite: !!findProject?.canBeWrite,
        canBeRead: Boolean(
          findProject?.canBeRead || specialInfo?.hasSenseiToken
        )
      };
    },
    [scope, specialInfo?.hasSenseiToken]
  );

  return (
    <ScopeContext.Provider
      value={{
        isAuthenticated:
          !!completedUser?.discordUserInfo &&
          !!completedUser?.jwt &&
          !!completedUser?.user,
        getScopeForProject,
        loading: loginLoading,
        loadingDiscordAuth,
        scope,
        onLoginDiscordAndGetScopeInBackend,
        jwt: completedUser?.jwt ?? null,
        onLogout,
        initLoading,
        onLogin,
        discordUserInfo: completedUser?.discordUserInfo ?? null,
        user: completedUser?.user ?? null,
        userCommunity,
        hasSenseiToken: specialInfo?.hasSenseiToken ?? false,
        hasAccess: specialInfo?.hasAccess ?? false
      }}
    >
      {children}
    </ScopeContext.Provider>
  );
};

export const useScope = () => {
  const context = useContext(ScopeContext);
  if (!context) {
    throw new Error('useScope must be used within an ScopeProvider');
  }
  return context;
};
