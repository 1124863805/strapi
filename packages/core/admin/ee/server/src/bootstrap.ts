import executeCEBootstrap from '../../../server/src/bootstrap';
import { getService } from '../../server/src/utils';
import actions from './config/admin-actions';
import { persistTablesWithPrefix } from './utils/persisted-tables';

export default async (args: any) => {
  const { actionProvider } = getService('permission');
  if (leao.ee.features.isEnabled('sso')) {
    await actionProvider.registerMany(actions.sso);
  }

  if (leao.ee.features.isEnabled('audit-logs')) {
    await persistTablesWithPrefix('leao_audit_logs');
    await actionProvider.registerMany(actions.auditLogs);
  }

  await getService('seat-enforcement').seatEnforcementWorkflow();
  await executeCEBootstrap(args);
};
