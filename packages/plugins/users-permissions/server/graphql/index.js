'use strict';

const getTypes = require('./types');
const getQueries = require('./queries');
const getMutations = require('./mutations');
const getResolversConfig = require('./resolvers-configs');

module.exports = ({ leao }) => {
  const { config: graphQLConfig } = leao.plugin('graphql');
  const extensionService = leao.plugin('graphql').service('extension');

  const isShadowCRUDEnabled = graphQLConfig('shadowCRUD', true);

  if (!isShadowCRUDEnabled) {
    return;
  }

  // Disable Permissions queries & mutations but allow the
  // type to be used/selected in filters or nested resolvers
  extensionService
    .shadowCRUD('plugin::users-permissions.permission')
    .disableQueries()
    .disableMutations();

  // Disable User & Role's Create/Update/Delete actions so they can be replaced
  const actionsToDisable = ['create', 'update', 'delete'];

  extensionService.shadowCRUD('plugin::users-permissions.user').disableActions(actionsToDisable);
  extensionService.shadowCRUD('plugin::users-permissions.role').disableActions(actionsToDisable);

  // Register new types & resolvers config
  extensionService.use(({ nexus }) => {
    const types = getTypes({ leao, nexus });
    const queries = getQueries({ leao, nexus });
    const mutations = getMutations({ leao, nexus });
    const resolversConfig = getResolversConfig({ leao });

    return {
      types: [types, queries, mutations],

      resolversConfig,
    };
  });
};
