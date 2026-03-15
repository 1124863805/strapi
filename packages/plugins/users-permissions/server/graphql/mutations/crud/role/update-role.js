'use strict';

const usersPermissionsRoleUID = 'plugin::users-permissions.role';

module.exports = ({ nexus, leao }) => {
  const { getContentTypeInputName } = leao.plugin('graphql').service('utils').naming;
  const { nonNull } = nexus;

  const roleContentType = leao.getModel(usersPermissionsRoleUID);

  const roleInputName = getContentTypeInputName(roleContentType);

  return {
    type: 'UsersPermissionsUpdateRolePayload',

    args: {
      id: nonNull('ID'),
      data: nonNull(roleInputName),
    },

    description: 'Update an existing role',

    async resolve(parent, args, context) {
      const { koaContext } = context;

      koaContext.params = { role: args.id };
      koaContext.request.body = args.data;
      koaContext.request.body.role = args.id;

      await leao.plugin('users-permissions').controller('role').updateRole(koaContext);

      return { ok: true };
    },
  };
};
