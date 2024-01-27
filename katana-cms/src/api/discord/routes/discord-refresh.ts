export default {
  routes: [
    {
      method: 'GET',
      path: '/discord/refresh-token',
      handler: 'discord-refresh.refreshToken',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
