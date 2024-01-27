module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/new-get-or-create-client',
      handler: 'auth.auth',
      config: {
        policies: [],
        middlewares: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/auth/ping',
      handler: 'auth.ping'
    }
  ]
};
