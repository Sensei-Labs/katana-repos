import { useMemo } from 'react';
import useSWRInmutable from 'swr/immutable';
import { fetcher } from '@/services/api';

export const useDiscord = () => {
  const { data: refreshData, isLoading: refreshLoading } =
    useSWRInmutable<RefreshDiscordToken>('/discord/refresh-token', fetcher);

  const accessToken = useMemo(() => {
    if (refreshLoading) return undefined;
    return refreshData?.access_token;
  }, [refreshData?.access_token, refreshLoading]);

  const { data: guildRolesData, isLoading: guildRolesLoading } =
    useSWRInmutable<DiscordRole[]>(`/discord/get-guild-roles`, fetcher);

  const guildRoles = useMemo(() => {
    if (guildRolesLoading) return [];
    return guildRolesData;
  }, [guildRolesData, guildRolesLoading]);

  const { data: userData, isLoading: userLoading } =
    useSWRInmutable<DiscordUser>(
      accessToken && `/discord/fetch-user?access_token=${accessToken}`,
      fetcher
    );
  const discordUser = useMemo(() => {
    if (userLoading) return undefined;
    return userData;
  }, [userData, userLoading]);

  const { data: guildMemberData, isLoading: uguildMemberLoading } =
    useSWRInmutable<DiscordGuildMember>(
      discordUser && `/discord/get-guild-member?user_id=${discordUser?.id}`,
      fetcher
    );

  const guildMember = useMemo(() => {
    if (uguildMemberLoading) return undefined;
    return guildMemberData;
  }, [guildMemberData, uguildMemberLoading]);

  return { guildRolesData, discordUser, guildMember, guildRoles };
};
