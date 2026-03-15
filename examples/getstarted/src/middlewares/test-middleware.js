'use strict';

/**
 * `test-middleware` middleware
 */

module.exports = (config, { leao }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    leao.log.info('In application test-middleware middleware.');

    await next();
  };
};
