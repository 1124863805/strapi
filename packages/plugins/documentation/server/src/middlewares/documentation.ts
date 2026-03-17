import path from 'path';
import send from 'koa-send';
import swaggerUi from 'swagger-ui-dist';

import type { Core } from '@leao1/types';

const SWAGGER_UI_ROOT = swaggerUi.getAbsoluteFSPath();

export const addDocumentMiddlewares = async ({ leao }: { leao: Core.Leao }) => {
  leao.server.routes([
    {
      method: 'GET',
      path: '/plugins/documentation/(.*)',
      async handler(ctx, next) {
        const filename = path.basename(ctx.path);
        if (!filename) return next();

        try {
          await send(ctx, filename, {
            root: SWAGGER_UI_ROOT,
            maxage: 86400000,
          });
        } catch (err: any) {
          if (err?.status === 404) return next();
          throw err;
        }
      },
      config: {
        auth: false,
      },
    },
  ]);
};
