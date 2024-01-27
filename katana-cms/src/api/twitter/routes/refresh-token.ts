export default {
  routes: [
    {
      method: 'GET',
      path: '/twitter/refresh-token',
      handler: 'refresh-token.refreshToken',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
