export default {
  routes: [
    {
      method: 'PUT',
      path: '/proposals/update-proposal/:id',
      handler: 'proposal.updateProposal'
    }
  ]
};
