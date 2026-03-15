import path from 'node:path';
import { LeaoMonorepo } from './monorepo';

/**
 * The path mappings/aliases used by various tools in the monorepo to map imported modules to
 * source files in order to speed up rebuilding and avoid having a separate watcher process to build
 * from `src` to `lib`.
 *
 * This file is currently read by:
 * - Webpack when running the dev server (only when running in this monorepo)
 */
const devAliases: Record<string, string> = {
  '@leao1/admin/leao-admin': './packages/core/admin/admin/src',
  '@leao1/content-releases/leao-admin': './packages/core/content-releases/admin/src',
  '@leao1/content-manager/leao-admin': './packages/core/content-manager/admin/src',
  '@leao1/content-type-builder/leao-admin': './packages/core/content-type-builder/admin/src',
  '@leao1/email/leao-admin': './packages/core/email/admin/src',
  '@leao1/upload/leao-admin': './packages/core/upload/admin/src',
  '@leao1/plugin-color-picker/leao-admin': './packages/plugins/color-picker/admin/src',
  '@leao1/plugin-documentation/leao-admin': './packages/plugins/documentation/admin/src',
  '@leao1/plugin-graphql/leao-admin': './packages/plugins/graphql/admin/src',
  '@leao1/i18n/leao-admin': './packages/plugins/i18n/admin/src',
  '@leao1/plugin-users-permissions/leao-admin': './packages/plugins/users-permissions/admin/src',
  '@leao1/review-workflows/leao-admin': './packages/core/review-workflows/admin/src',
};

const getMonorepoAliases = ({ monorepo }: { monorepo?: LeaoMonorepo }) => {
  if (!monorepo?.path) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(devAliases).map(([key, modulePath]) => {
      return [key, path.join(monorepo.path, modulePath)];
    })
  );
};

export { getMonorepoAliases };
