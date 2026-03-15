import type { Core } from '@leao/types';
import registerAdminPanelRoute from './routes/serve-admin-panel';
import adminAuthStrategy from './strategies/admin';
import apiTokenAuthStrategy from './strategies/api-token';

export default ({ leao }: { leao: Core.Leao }) => {
  const passportMiddleware = leao.service('admin::passport').init();

  leao.server.api('admin').use(passportMiddleware);
  leao.get('auth').register('admin', adminAuthStrategy);
  leao.get('auth').register('content-api', apiTokenAuthStrategy);

  if (leao.config.get('admin.serveAdminPanel')) {
    registerAdminPanelRoute({ leao });
  }
};
