export default {
  routes: [
    {
      method: 'GET',
      path: '/discord/url',
      handler: 'discord.getDiscordUrl',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/discord/katana-roles',
      handler: 'discord.getKatanaRoles',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/discord/simple-auth',
      handler: 'discord.simpleAuth',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/discord/current-user',
      handler: 'discord.getDiscordSimpleCurrentUser',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/discord/katana/current-member',
      handler: 'discord.getDiscordKatanaServerCurrentMemberInfo',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/discord/current/user-roles-status',
      handler: 'discord.getDiscordUserRolesStatus',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
