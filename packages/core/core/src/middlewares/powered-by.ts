import type { Core } from '@leao/types';

export interface Config {
  poweredBy: string;
}

const defaults: Config = {
  poweredBy: '',
};

export const poweredBy: Core.MiddlewareFactory<Partial<Config>> = (config) => {
  const { poweredBy } = { ...defaults, ...config };

  return async (ctx, next) => {
    await next();

    ctx.set('X-Powered-By', poweredBy);
  };
};
