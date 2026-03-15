import type { Core } from '@leao1/types';

export const enableFeatureMiddleware =
  (featureName: string): Core.MiddlewareHandler =>
  (ctx, next) => {
    if (leao.ee.features.isEnabled(featureName)) {
      return next();
    }

    ctx.status = 404;
  };
