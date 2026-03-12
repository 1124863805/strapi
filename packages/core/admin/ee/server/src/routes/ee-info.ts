export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/ee-info',
      handler: 'admin.getEEInfo',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: [
                'admin::users.create',
                'admin::users.read',
                'admin::users.update',
                'admin::users.delete',
              ],
            },
          },
        ],
      },
    },
  ],
};
