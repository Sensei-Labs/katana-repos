export default {
  routes: [
    {
      method: 'POST',
      path: '/discord/discord-login',
      handler: 'discord-login.loginDiscord',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
