'use strict';

/**
 * question router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::question.question', {
  config: {
    create: {
      policies: [],
      middlewares: []
    }
  }
});
