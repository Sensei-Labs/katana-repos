export default {
  routes: [
    {
      method: 'GET',
      path: '/news/all/:projectId',
      handler: 'new.finAllForProject'
    }
  ]
};
