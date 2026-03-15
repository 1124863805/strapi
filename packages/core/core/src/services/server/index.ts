import Router from '@koa/router';
import type { Core, Modules } from '@leao/types';

import { createHTTPServer } from './http-server';
import { createRouteManager } from './routing';
import { createAdminAPI } from './admin-api';
import { createContentAPI } from './content-api';
import registerAllRoutes from './register-routes';
import registerApplicationMiddlewares from './register-middlewares';
import createKoaApp from './koa';
import requestCtx from '../request-context';

const healthCheck: Core.MiddlewareHandler = async (ctx) => {
  ctx.set('leao', 'You are so French!');
  ctx.status = 204;
};

const createServer = (leao: Core.Leao): Modules.Server.Server => {
  const app = createKoaApp({
    proxy: leao.config.get('server.proxy.koa'),
    keys: leao.config.get('server.app.keys'),
  });

  app.use((ctx, next) => requestCtx.run(ctx, () => next()));

  const router = new Router();

  const routeManager = createRouteManager(leao);

  const httpServer = createHTTPServer(leao, app);

  const apis = {
    'content-api': createContentAPI(leao),
    admin: createAdminAPI(leao),
  };

  // init health check
  router.all('/_health', healthCheck);

  const state = {
    mounted: false,
  };

  return {
    app,
    router,
    httpServer,

    api(name) {
      return apis[name];
    },

    use(...args) {
      app.use(...args);
      return this;
    },

    routes(routes: Core.Router | Omit<Core.Route, 'info'>[]) {
      if (!Array.isArray(routes) && routes.type) {
        const api = apis[routes.type];
        if (!api) {
          throw new Error(`API ${routes.type} not found. Possible APIs are ${Object.keys(apis)}`);
        }

        apis[routes.type].routes(routes);
        return this;
      }

      routeManager.addRoutes(routes, router);
      return this;
    },

    mount() {
      state.mounted = true;

      Object.values(apis).forEach((api) => api.mount(router));
      app.use(router.routes()).use(router.allowedMethods());

      return this;
    },

    initRouting() {
      registerAllRoutes(leao);

      return this;
    },

    async initMiddlewares() {
      await registerApplicationMiddlewares(leao);

      return this;
    },

    listRoutes() {
      return [...router.stack];
    },

    listen(...args: any[]) {
      if (!state.mounted) {
        this.mount();
      }

      return httpServer.listen(...args);
    },

    async destroy() {
      await httpServer.destroy();
    },
  };
};

export { createServer };
