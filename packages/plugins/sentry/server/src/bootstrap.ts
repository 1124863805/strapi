import type { Core } from '@leao/leao';
import initSentryMiddleware from './middlewares/sentry';

export default async ({ leao }: { leao: Core.Leao }) => {
  // Initialize the Sentry service exposed by this plugin
  initSentryMiddleware({ leao });
};
