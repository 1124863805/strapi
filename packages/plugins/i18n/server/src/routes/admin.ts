export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/iso-locales',
      handler: 'iso-locales.listIsoLocales',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: { actions: [{ action: 'plugin::i18n.locale.read', subject: null }] },
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/locales',
      handler: 'locales.listLocales',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'POST',
      path: '/locales',
      handler: 'locales.createLocale',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: { actions: [{ action: 'plugin::i18n.locale.create', subject: null }] },
          },
        ],
      },
    },
    {
      method: 'PUT',
      path: '/locales/:id',
      handler: 'locales.updateLocale',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: { actions: [{ action: 'plugin::i18n.locale.update', subject: null }] },
          },
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/locales/:id',
      handler: 'locales.deleteLocale',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: { actions: [{ action: 'plugin::i18n.locale.delete', subject: null }] },
          },
        ],
      },
    },
    {
      method: 'POST',
      path: '/content-manager/actions/get-non-localized-fields',
      handler: 'content-types.getNonLocalizedAttributes',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
