import { policy as policyUtils, errors } from '@leao/utils';
import type { Core } from '@leao/types';

const createPolicicesMiddleware = (route: Core.Route, leao: Core.Leao) => {
  const policiesConfig = route?.config?.policies ?? [];
  const resolvedPolicies = leao.get('policies').resolve(policiesConfig, route.info);

  const policiesMiddleware: Core.MiddlewareHandler = async (ctx, next) => {
    const context = policyUtils.createPolicyContext('koa', ctx);

    for (const { handler, config } of resolvedPolicies) {
      const result = await handler(context, config, { leao });

      if (![true, undefined].includes(result)) {
        throw new errors.PolicyError();
      }
    }

    await next();
  };

  return policiesMiddleware;
};

export { createPolicicesMiddleware };
