'use strict';

const { createCoreRouter } = require('@leao1/leao').factories;

module.exports = createCoreRouter('api::address.address', {
  config: {
    find: {
      // auth: false,
    },
  },
  only: ['find', 'findOne'],
});
