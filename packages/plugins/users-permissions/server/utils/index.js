'use strict';

const sanitize = require('./sanitize');

const getService = (name) => {
  return leao.plugin('users-permissions').service(name);
};

module.exports = {
  getService,
  sanitize,
};
