import { merge, map, difference, uniq } from 'lodash/fp';
import type { Core } from '@leao/types';
import { async } from '@leao/utils';
import { getService } from './utils';
import adminActions from './config/admin-actions';
import adminConditions from './config/admin-conditions';

const defaultAdminAuthSettings = {
  providers: {
    autoRegister: false,
    defaultRole: null,
    ssoLockedRoles: null,
  },
};

const registerPermissionActions = async () => {
  await getService('permission').actionProvider.registerMany(adminActions.actions);
};

const registerAdminConditions = async () => {
  await getService('permission').conditionProvider.registerMany(adminConditions.conditions);
};

const syncAuthSettings = async () => {
  const adminStore = await leao.store({ type: 'core', name: 'admin' });
  const adminAuthSettings = await adminStore.get({ key: 'auth' });
  const newAuthSettings = merge(defaultAdminAuthSettings, adminAuthSettings);

  const roleExists = await getService('role').exists({
    id: newAuthSettings.providers.defaultRole,
  });

  // Reset the default SSO role if it has been deleted manually
  if (!roleExists) {
    newAuthSettings.providers.defaultRole = null;
  }

  await adminStore.set({ key: 'auth', value: newAuthSettings });
};

const syncAPITokensPermissions = async () => {
  const validPermissions = leao.contentAPI.permissions.providers.action.keys();
  const permissionsInDB = await async.pipe(
    leao.db.query('admin::api-token-permission').findMany,
    map('action')
  )();

  const unknownPermissions = uniq(difference(permissionsInDB, validPermissions));

  if (unknownPermissions.length > 0) {
    await leao.db
      .query('admin::api-token-permission')
      .deleteMany({ where: { action: { $in: unknownPermissions } } });
  }
};

export default async ({ leao }: { leao: Core.Leao }) => {
  await registerAdminConditions();
  await registerPermissionActions();

  const permissionService = getService('permission');
  const userService = getService('user');
  const roleService = getService('role');
  const apiTokenService = getService('api-token');
  const transferService = getService('transfer');
  const tokenService = getService('token');

  await roleService.createRolesIfNoneExist();
  await roleService.resetSuperAdminPermissions();
  await roleService.displayWarningIfNoSuperAdmin();

  await permissionService.cleanPermissionsInDatabase();

  await userService.displayWarningIfUsersDontHaveRole();

  await syncAuthSettings();
  await syncAPITokensPermissions();

  apiTokenService.checkSaltIsDefined();
  transferService.token.checkSaltIsDefined();
  tokenService.checkSecretIsDefined();
};
