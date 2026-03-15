import type { Core } from '@leao1/types';

export const logger: Core.MiddlewareFactory = (_, { leao }) => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Math.ceil(Date.now() - start);

    leao.log.http(`${ctx.method} ${ctx.url} (${delta} ms) ${ctx.status}`);
  };
};
