'use strict';

const crudActionsToDisable = ['create', 'update', 'delete'];

module.exports = ({ leao }) => {
  const extension = leao.plugin('graphql').service('extension');

  extension.shadowCRUD('plugin::myplugin.test').disableActions(crudActionsToDisable);
};
