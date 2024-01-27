import { AxiosResponse } from 'axios';
import { getDiscordLoginUrl } from '../utils';
import { DiscordAccessTokenResults, DiscordCurrentUser, DiscordGuildMemberInfo, DiscordServerRole } from '../types';

export default {
  getDiscordUrl: (ctx) => {
    ctx.send({
      url: getDiscordLoginUrl()
    });
  },

  getKatanaRoles: async (ctx) => {
    const discordService = strapi.service('api::discord.discord');

    try {
      const response = (await discordService.getDiscordKatanaServerRoles()) as AxiosResponse<DiscordServerRole[]>;
      ctx.status = response.status;
      ctx.body = response.data;
    } catch (err: any) {
      console.log('Discord Error', { err });
      if (err?.response?.status) ctx.status = err.response.status;
      if (err?.response?.data) ctx.body = err.response.data;
    }
  },

  simpleAuth: async (ctx) => {
    const { code } = ctx.request.body;
    const discordService = strapi.service('api::discord.discord');

    try {
      const response = (await discordService.simpleDiscordLogin(code)) as AxiosResponse<DiscordAccessTokenResults>;
      ctx.status = response.status;
      ctx.body = response.data;
    } catch (err: any) {
      console.log('Discord Error', { err });
      if (err?.response?.status) ctx.status = err.response.status;
      if (err?.response?.data) ctx.body = err.response.data;
    }
  },

  getDiscordSimpleCurrentUser: async (ctx) => {
    const { accessToken } = ctx.request.body;
    const discordService = strapi.service('api::discord.discord');

    try {
      const response = (await discordService.getDiscordUserInfo(accessToken)) as AxiosResponse<DiscordCurrentUser>;
      ctx.status = response.status;
      ctx.body = response.data;
    } catch (err: any) {
      console.log('Discord Error', { err });
      if (err?.response?.status) ctx.status = err.response.status;
      if (err?.response?.data) ctx.body = err.response.data;
    }
  },

  getDiscordKatanaServerCurrentMemberInfo: async (ctx) => {
    const { accessToken } = ctx.request.body;
    const discordService = strapi.service('api::discord.discord');

    try {
      const userResponse = (await discordService.getDiscordUserInfo(accessToken)) as AxiosResponse<DiscordCurrentUser>;
      const userId = userResponse?.data?.id;

      const response = (await discordService.getDiscordKatanaMemberInfo(userId)) as AxiosResponse<DiscordGuildMemberInfo>;
      ctx.status = response.status;
      ctx.body = response.data;
    } catch (err: any) {
      console.log('Discord Error', { err });
      if (err?.response?.status) ctx.status = err.response.status;
      if (err?.response?.data) ctx.body = err.response.data;
    }
  },

  getDiscordUserRolesStatus: async (ctx) => {
    const { accessToken } = ctx.request.body;
    const discordService = strapi.service('api::discord.discord');

    try {
      const rolesResponse = (await discordService.getDiscordKatanaServerRoles()) as AxiosResponse<DiscordServerRole[]>;
      const roles = rolesResponse.data;

      const userResponse = (await discordService.getDiscordUserInfo(accessToken)) as AxiosResponse<DiscordCurrentUser>;
      const userId = userResponse?.data?.id;

      const memberResponse = (await discordService.getDiscordKatanaMemberInfo(
        userId
      )) as AxiosResponse<DiscordGuildMemberInfo>;
      const member = memberResponse.data;
      const memberRolesIds = member.roles;

      const serverMatchedRoles = roles.filter((role) => memberRolesIds.includes(role.id));
      const memberRolesNames = serverMatchedRoles.map((role) => role.name);

      ctx.body = memberRolesNames;
    } catch (err: any) {
      console.log('Discord Error', { err });
      if (err?.response?.status) ctx.status = err.response.status;
      if (err?.response?.data) ctx.body = err.response.data;
    }
  }

  // fristAuth: async (ctx, _next) => {
  //   const { code } = ctx.request.body;
  //   const user: StrapiUser = ctx.state?.user;

  //   try {
  //     const response = await discordApi({
  //       url: '/oauth2/token',
  //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //       method: 'post',
  //       data: {
  //         code,
  //         client_id,
  //         client_secret,
  //         redirect_uri,
  //         grant_type: 'authorization_code'
  //       }
  //     });

  //     await strapi.entityService.update('plugin::users-permissions.user', user?.id, {
  //       data: { discordToken: response.data.refresh_token }
  //     });

  //     const response2 = await discordApi.get('/users/@me', {
  //       headers: { Authorization: `Bearer ${response.data.access_token}` }
  //     });

  //     await strapi.entityService.update('plugin::users-permissions.user', user?.id, {
  //       data: { discordUsername: response2.data.username, discordEmail: response2.data.email }
  //     });

  //     ctx.body = response.data;
  //   } catch (err) {
  //     ctx.body = err.response.data;
  //   }
  // }
};
