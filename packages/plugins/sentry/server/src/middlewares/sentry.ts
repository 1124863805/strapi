import type { Core } from '@leao/leao';
import type Sentry from '@sentry/node';
import type createSentryService from '../services/sentry';

/**
 * Programmatic sentry middleware. We do not want to expose it in the plugin
 */
export default ({ leao }: { leao: Core.Leao }) => {
  const sentryService: ReturnType<typeof createSentryService> = leao
    .plugin('sentry')
    .service('sentry');
  sentryService.init();
  const sentry = sentryService.getInstance();

  if (!sentry) {
    // initialization failed
    return;
  }

  leao.server.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof Error) {
        sentryService.sendError(error, (scope: Sentry.Scope) => {
          scope.addEventProcessor((event) => {
            // Parse Koa context to add error metadata
            return sentry.Handlers.parseRequest(event, ctx.request as Sentry.Request, {
              // Don't parse the transaction name, we'll do it manually
              transaction: false,
            });
          });

          // Manually add transaction name
          scope.setTag('transaction', `${ctx.method} ${ctx._matchedRoute}`);
          // Manually add Leao version
          scope.setTag('leao_version', leao.config.info.leao);
          scope.setTag('method', ctx.method);
        });
      }

      throw error;
    }
  });
};
