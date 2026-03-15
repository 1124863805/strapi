import _ from 'lodash';
import type { Core } from '@leao1/types';

const createRouteScopeGenerator = (namespace: string) => (route: Core.RouteInput) => {
  const prefix = namespace.endsWith('::') ? namespace : `${namespace}.`;

  if (typeof route.handler === 'string') {
    _.defaultsDeep(route, {
      config: {
        auth: {
          scope: [`${route.handler.startsWith(prefix) ? '' : prefix}${route.handler}`],
        },
      },
    });
  }
};

/**
 * Register all routes
 */
export default (leao: Core.Leao) => {
  registerAdminRoutes(leao);
  registerAPIRoutes(leao);
  registerPluginRoutes(leao);
};

/**
 * Register admin routes
 * @param {import('../../').Leao} leao
 */
const registerAdminRoutes = (leao: Core.Leao) => {
  const generateRouteScope = createRouteScopeGenerator(`admin::`);

  _.forEach(leao.admin.routes, (router) => {
    router.type = router.type || 'admin';
    router.prefix = router.prefix || `/admin`;
    router.routes.forEach((route) => {
      generateRouteScope(route);
      route.info = { pluginName: 'admin' };
    });
    leao.server.routes(router);
  });
};

/**
 * Register plugin routes
 * @param {import('../../').Leao} leao
 */
const registerPluginRoutes = (leao: Core.Leao) => {
  for (const pluginName of Object.keys(leao.plugins)) {
    const plugin = leao.plugins[pluginName];

    const generateRouteScope = createRouteScopeGenerator(`plugin::${pluginName}`);

    if (Array.isArray(plugin.routes)) {
      plugin.routes.forEach((route) => {
        generateRouteScope(route);
        route.info = { pluginName };
      });

      leao.server.routes({
        type: 'admin',
        prefix: `/${pluginName}`,
        routes: plugin.routes,
      });
    } else {
      _.forEach(plugin.routes, (router) => {
        router.type = router.type || 'admin';
        router.prefix = router.prefix || `/${pluginName}`;
        router.routes.forEach((route) => {
          generateRouteScope(route);
          route.info = { pluginName };
        });

        leao.server.routes(router);
      });
    }
  }
};

/**
 * Register api routes
 */
const registerAPIRoutes = (leao: Core.Leao) => {
  for (const apiName of Object.keys(leao.apis)) {
    const api = leao.api(apiName);

    const generateRouteScope = createRouteScopeGenerator(`api::${apiName}`);

    _.forEach(api.routes, (router) => {
      // TODO: remove once auth setup
      // pass meta down to compose endpoint
      router.type = 'content-api';
      router.routes?.forEach((route) => {
        generateRouteScope(route);
        route.info = { apiName };
      });

      return leao.server.routes(router);
    });
  }
};
