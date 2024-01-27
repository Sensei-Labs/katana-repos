export default {
  routes: [
    {
      method: 'POST',
      path: '/twitter/first-auth',
      handler: 'twitter.firstAuth',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
