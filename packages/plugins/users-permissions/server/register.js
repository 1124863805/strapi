'use strict';

const fs = require('fs');
const path = require('path');

const authStrategy = require('./strategies/users-permissions');
const sanitizers = require('./utils/sanitize/sanitizers');

module.exports = ({ leao }) => {
  leao.get('auth').register('content-api', authStrategy);
  leao.sanitizers.add('content-api.output', sanitizers.defaultSanitizeOutput);

  if (leao.plugin('graphql')) {
    require('./graphql')({ leao });
  }

  if (leao.plugin('documentation')) {
    const specPath = path.join(__dirname, '../documentation/content-api.yaml');
    const spec = fs.readFileSync(specPath, 'utf8');

    leao
      .plugin('documentation')
      .service('override')
      .registerOverride(spec, {
        pluginOrigin: 'users-permissions',
        excludeFromGeneration: ['users-permissions'],
      });
  }
};
