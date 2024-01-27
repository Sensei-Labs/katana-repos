export default {
  routes: [
    {
      method: 'GET',
      path: '/twitter/get-user',
      handler: 'twitter-get-user.getUser',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
