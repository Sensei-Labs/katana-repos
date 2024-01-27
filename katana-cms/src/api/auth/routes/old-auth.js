module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/get-or-create-client',
      handler: 'old-auth.auth',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/auth/ping',
      handler: 'old-auth.ping'
    }
  ]
};
