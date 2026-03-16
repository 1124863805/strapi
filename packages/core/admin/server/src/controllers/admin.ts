import type { Context } from 'koa';

import path from 'path';

import { exists } from 'fs-extra';
import '@leao1/types';
import {
  validateUpdateProjectSettings,
  validateUpdateProjectSettingsFiles,
  validateUpdateProjectSettingsImagesDimensions,
} from '../validation/project-settings';
import { getService } from '../utils';

import type {
  Init,
  GetProjectSettings,
  Information,
  Plugins,
  UpdateProjectSettings,
} from '../../../shared/contracts/admin';

/**
 * A set of functions called "actions" for `Admin`
 */
export default {
  async getProjectType() {
    const flags = leao.config.get('admin.flags', {});
    return {
      data: {
        isEE: leao.EE,
        features: leao.ee.features.list(),
        flags,
      },
    };
  },

  async init() {
    const uuid = leao.config.get('uuid', false);
    const hasAdmin = await getService('user').exists();
    const { menuLogo, authLogo } = await getService('project-settings').getProjectSettings();

    return {
      data: {
        uuid,
        hasAdmin,
        menuLogo: menuLogo ? menuLogo.url : null,
        authLogo: authLogo ? authLogo.url : null,
      },
    } satisfies Init.Response;
  },

  async getProjectSettings() {
    return getService(
      'project-settings'
    ).getProjectSettings() satisfies Promise<GetProjectSettings.Response>;
  },

  async updateProjectSettings(ctx: Context) {
    const {
      request: { files, body },
    } = ctx as { request: UpdateProjectSettings.Request };

    const projectSettingsService = getService('project-settings');

    await validateUpdateProjectSettings(body);
    await validateUpdateProjectSettingsFiles(files);

    const formatedFiles = await projectSettingsService.parseFilesData(files);
    await validateUpdateProjectSettingsImagesDimensions(formatedFiles);

    return projectSettingsService.updateProjectSettings({
      ...body,
      ...formatedFiles,
    }) satisfies Promise<UpdateProjectSettings.Response>;
  },

  async information() {
    const currentEnvironment: string = leao.config.get('environment');
    const autoReload = leao.config.get('autoReload', false);
    const leaoVersion = leao.config.get('info.leao', null);
    const dependencies = leao.config.get('info.dependencies', {});
    const projectId = leao.config.get('uuid', null);
    const nodeVersion = process.version;
    const communityEdition = false;
    const useYarn: boolean = await exists(path.join(process.cwd(), 'yarn.lock'));

    return {
      data: {
        currentEnvironment,
        autoReload,
        leaoVersion,
        dependencies,
        projectId,
        nodeVersion,
        communityEdition,
        useYarn,
      },
    } satisfies Information.Response;
  },

  async plugins(ctx: Context) {
    const enabledPlugins = leao.config.get('enabledPlugins') as any;

    // List of core plugins that are always enabled,
    // and so it's not necessary to display them in the plugins list
    const CORE_PLUGINS = [
      'content-manager',
      'content-type-builder',
      'email',
      'upload',
      'i18n',
      'content-releases',
      'review-workflows',
    ];

    const plugins = Object.entries(enabledPlugins)
      .filter(([key]: any) => !CORE_PLUGINS.includes(key))
      .map(([key, plugin]: any) => ({
        name: plugin.info.name || key,
        displayName: plugin.info.displayName || plugin.info.name || key,
        description: plugin.info.description || '',
        packageName: plugin.info.packageName,
      }));

    ctx.send({ plugins }) satisfies Plugins.Response;
  },
};
