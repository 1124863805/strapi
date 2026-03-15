'use strict';

const responseHandlers = require('./src/response-handlers');

module.exports = [
  'leao::logger',
  'leao::errors',
  'leao::security',
  'leao::cors',
  'leao::poweredBy',
  'leao::query',
  'leao::body',
  'leao::session',
  // 'leao::compression',
  // 'leao::ip',
  {
    name: 'leao::responses',
    config: {
      handlers: responseHandlers,
    },
  },
  'leao::favicon',
  'leao::public',
  {
    name: 'global::test-middleware',
    config: {
      foo: 'bar',
    },
  },
  {
    resolve: './src/custom/middleware.js',
    config: {},
  },
];
