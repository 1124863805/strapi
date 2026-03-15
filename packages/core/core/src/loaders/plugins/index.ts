import { join } from 'path';
import fse from 'fs-extra';
import { defaultsDeep, defaults, getOr, get } from 'lodash/fp';
import * as resolve from 'resolve.exports';

import { env } from '@leao/utils';
import type { Core, Plugin, Struct } from '@leao/types';
import { loadConfigFile } from '../../utils/load-config-file';
import { loadFiles } from '../../utils/load-files';
import { getEnabledPlugins } from './get-enabled-plugins';
import { getUserPluginsConfig } from './get-user-plugins-config';
import { getGlobalId } from '../../domain/content-type';

interface Plugins {
  [key: string]: Plugin.LoadedPlugin;
}

const defaultPlugin = {
  bootstrap() {},
  destroy() {},
  register() {},
  config: {
    default: {},
    validator() {},
  },
  routes: [],
  controllers: {},
  services: {},
  policies: {},
  middlewares: {},
  contentTypes: {},
};

const applyUserExtension = async (plugins: Plugins) => {
  const extensionsDir = leao.dirs.dist.extensions;
  if (!(await fse.pathExists(extensionsDir))) {
    return;
  }

  const extendedSchemas = await loadFiles(extensionsDir, '**/content-types/**/schema.json');
  const leaoServers = await loadFiles(extensionsDir, '**/leao-server.js');

  for (const pluginName of Object.keys(plugins)) {
    const plugin = plugins[pluginName];
    // first: load json schema
    for (const ctName of Object.keys(plugin.contentTypes)) {
      const extendedSchema = get([pluginName, 'content-types', ctName, 'schema'], extendedSchemas);
      if (extendedSchema) {
        plugin.contentTypes[ctName].schema = {
          ...plugin.contentTypes[ctName].schema,
          ...extendedSchema,
        };
      }
    }
    // second: execute leao-server extension
    const leaoServer = get([pluginName, 'leao-server'], leaoServers);
    if (leaoServer) {
      plugins[pluginName] = await leaoServer(plugin);
    }
  }
};

const applyUserConfig = async (plugins: Plugins) => {
  const userPluginsConfig = await getUserPluginsConfig();

  for (const pluginName of Object.keys(plugins)) {
    const plugin = plugins[pluginName];
    const userPluginConfig = getOr({}, `${pluginName}.config`, userPluginsConfig);
    const defaultConfig =
      typeof plugin.config.default === 'function'
        ? plugin.config.default({ env })
        : plugin.config.default;

    const config = defaultsDeep(defaultConfig, userPluginConfig);
    try {
      plugin.config.validator(config);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Error regarding ${pluginName} config: ${e.message}`);
      }

      throw e;
    }
    plugin.config = config;
  }
};

export default async function loadPlugins(leao: Core.Leao) {
  const plugins: Plugins = {};

  const enabledPlugins = await getEnabledPlugins(leao);

  leao.config.set('enabledPlugins', enabledPlugins);

  for (const pluginName of Object.keys(enabledPlugins)) {
    const enabledPlugin = enabledPlugins[pluginName];

    let serverEntrypointPath;
    let resolvedExport = './leao-server.js';

    try {
      resolvedExport = (
        resolve.exports(enabledPlugin.packageInfo, 'leao-server', {
          require: true,
        }) ?? './leao-server.js'
      ).toString();
    } catch (e) {
      // no export map or missing leao-server export => fallback to default
    }

    try {
      serverEntrypointPath = join(enabledPlugin.pathToPlugin, resolvedExport);
    } catch (e) {
      throw new Error(
        `Error loading the plugin ${pluginName} because ${pluginName} is not installed. Please either install the plugin or remove it's configuration.`
      );
    }

    // only load plugins with a server entrypoint
    if (!(await fse.pathExists(serverEntrypointPath))) {
      continue;
    }

    const pluginServer = loadConfigFile(serverEntrypointPath);
    plugins[pluginName] = {
      ...defaultPlugin,
      ...pluginServer,
      contentTypes: formatContentTypes(pluginName, pluginServer.contentTypes ?? {}),
      config: defaults(defaultPlugin.config, pluginServer.config),
      routes: pluginServer.routes ?? defaultPlugin.routes,
    };
  }

  // TODO: validate plugin format
  await applyUserConfig(plugins);
  await applyUserExtension(plugins);

  for (const pluginName of Object.keys(plugins)) {
    leao.get('plugins').add(pluginName, plugins[pluginName]);
  }
}

const formatContentTypes = (
  pluginName: string,
  contentTypes: Record<string, { schema: Struct.ContentTypeSchema }>
) => {
  Object.values(contentTypes).forEach((definition) => {
    const { schema } = definition;

    Object.assign(schema, {
      plugin: pluginName,
      collectionName:
        schema.collectionName || `${pluginName}_${schema.info.singularName}`.toLowerCase(),
      globalId: getGlobalId(schema, pluginName),
    });
  });

  return contentTypes;
};
