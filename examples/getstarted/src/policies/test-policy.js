'use strict';

/**
 * `test-policy` policy
 */

module.exports = (policyCtx, config, { leao }) => {
  // Add your own logic here.
  leao.log.info('In test-policy policy.');

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
