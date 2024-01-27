'use strict';

/**
 * treasury custom router
 */
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/notifyAll',
      handler: 'push-notification.notifyAll',
      config: {
        auth: false
      }
    }
  ]
};
