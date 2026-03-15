import { toLower, castArray, trim, prop, isNil } from 'lodash/fp';
import type { Core, UID } from '@leao1/types';
import { errors } from '@leao1/utils';
import Router from '@koa/router';

import compose from 'koa-compose';
import { resolveRouteMiddlewares } from './middleware';
import { createPolicicesMiddleware } from './policy';

const getMethod = (route: Core.Route) => {
  return trim(toLower(route.method)) as Lowercase<Core.Route['method']>;
};

const getPath = (route: Core.Route) => trim(route.path);

const createRouteInfoMiddleware =
  (routeInfo: Core.Route): Core.MiddlewareHandler =>
  (ctx, next) => {
    const route = {
      ...routeInfo,
      config: routeInfo.config || {},
    };

    ctx.state.route = route;
    return next();
  };

const getAuthConfig = prop('config.auth');

const createAuthorizeMiddleware =
  (leao: Core.Leao): Core.MiddlewareHandler =>
  async (ctx, next) => {
    const { auth, route } = ctx.state;

    const authService = leao.get('auth');

    try {
      await authService.verify(auth, getAuthConfig(route));

      return await next();
    } catch (error) {
      if (error instanceof errors.UnauthorizedError) {
        return ctx.unauthorized();
      }

      if (error instanceof errors.ForbiddenError) {
        // allow PolicyError as an exception to throw a publicly visible message in the API
        if (error instanceof errors.PolicyError) {
          throw error;
        }
        return ctx.forbidden();
      }

      throw error;
    }
  };

const createAuthenticateMiddleware =
  (leao: Core.Leao): Core.MiddlewareHandler =>
  async (ctx, next) => {
    return leao.get('auth').authenticate(ctx, next);
  };

const returnBodyMiddleware: Core.MiddlewareHandler = async (ctx, next) => {
  const values = await next();

  if (isNil(ctx.body) && !isNil(values)) {
    ctx.body = values;
  }
};

export default (leao: Core.Leao) => {
  const authenticate = createAuthenticateMiddleware(leao);
  const authorize = createAuthorizeMiddleware(leao);

  return (route: Core.Route, { router }: { router: Router }) => {
    try {
      const method = getMethod(route);
      const path = getPath(route);

      const middlewares = resolveRouteMiddlewares(route, leao);

      const action = getAction(route, leao);

      const routeHandler = compose([
        createRouteInfoMiddleware(route),
        authenticate,
        authorize,
        createPolicicesMiddleware(route, leao),
        ...middlewares,
        returnBodyMiddleware,
        ...castArray(action),
      ]);

      router[method](path, routeHandler);
    } catch (error) {
      if (error instanceof Error) {
        error.message = `Error creating endpoint ${route.method} ${route.path}: ${error.message}`;
      }

      throw error;
    }
  };
};

const getController = (
  name: string,
  { pluginName, apiName }: Core.RouteInfo,
  leao: Core.Leao
) => {
  let ctrl: Core.Controller | undefined;

  if (pluginName) {
    if (pluginName === 'admin') {
      ctrl = leao.controller(`admin::${name}`);
    } else {
      ctrl = leao.plugin(pluginName).controller(name);
    }
  } else if (apiName) {
    ctrl = leao.controller(`api::${apiName}.${name}`);
  }

  if (!ctrl) {
    return leao.controller(name as UID.Controller);
  }

  return ctrl;
};

const extractHandlerParts = (name: string) => {
  const controllerName = name.slice(0, name.lastIndexOf('.'));
  const actionName = name.slice(name.lastIndexOf('.') + 1);

  return { controllerName, actionName };
};

const getAction = (route: Core.Route, leao: Core.Leao) => {
  const { handler, info } = route;
  const { pluginName, apiName, type } = info ?? {};

  if (Array.isArray(handler) || typeof handler === 'function') {
    return handler;
  }

  const { controllerName, actionName } = extractHandlerParts(trim(handler));

  const controller = getController(controllerName, { pluginName, apiName, type }, leao);

  if (typeof controller[actionName] !== 'function') {
    throw new Error(`Handler not found "${handler}"`);
  }

  if (Symbol.for('__type__') in controller[actionName]) {
    (controller[actionName] as any)[Symbol.for('__type__')].push(type);
  } else {
    (controller[actionName] as any)[Symbol.for('__type__')] = [type];
  }

  return controller[actionName].bind(controller);
};
