import { join } from 'node:path';
import fs from 'fs-extra';
import type { PromptQuestion } from 'node-plop';

export default (
  action: string,
  basePath: string,
  { rootFolder = false } = {}
): PromptQuestion[] => [
  {
    type: 'list',
    name: 'destination',
    message: `Where do you want to add this ${action}?`,
    choices: [
      ...(rootFolder ? [{ name: `Add ${action} to root of project`, value: 'root' }] : []),
      ...(!rootFolder ? [{ name: `Add ${action} to new API`, value: 'new' }] : []),
      { name: `Add ${action} to an existing API`, value: 'api' },
      { name: `Add ${action} to an existing plugin`, value: 'plugin' },
    ],
  },
  {
    when: (answers) => answers?.destination === 'api',
    type: 'list',
    message: 'Which API is this for?',
    name: 'api',
    async choices() {
      const apiPath = join(basePath, 'api');
      if (!(await fs.pathExists(apiPath))) throw new Error('Couldn\'t find an "api" directory');
      const apiDir = await fs.readdir(apiPath, { withFileTypes: true });
      const dirs = apiDir.filter((fd) => fd.isDirectory());
      if (dirs.length === 0) throw new Error('The "api" directory is empty');
      return dirs;
    },
  },
  {
    when: (answers) => answers?.destination === 'plugin',
    type: 'list',
    message: 'Which plugin is this for?',
    name: 'plugin',
    async choices() {
      const pluginsPath = join(basePath, 'plugins');
      if (!(await fs.pathExists(pluginsPath))) throw new Error('Couldn\'t find a "plugins" directory');
      const pluginsDir = await fs.readdir(pluginsPath);
      const dirs = pluginsDir.filter((name) => fs.lstatSync(join(pluginsPath, name)).isDirectory());
      if (dirs.length === 0) throw new Error('The "plugins" directory is empty');
      return dirs;
    },
  },
];
