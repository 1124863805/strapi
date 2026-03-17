import { join } from 'node:path';
import type { NodePlopAPI } from 'plop';
import fs from 'fs-extra';
import tsUtils from '@leao1/config';
import validateInput from './utils/validate-input';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('api', {
    description: 'Generate a basic API',
    prompts: [
      { type: 'input', name: 'id', message: 'API name', validate: (input) => validateInput(input) },
      { type: 'confirm', name: 'isPluginApi', message: 'Is this API for a plugin?' },
      {
        when: (answers) => answers?.isPluginApi,
        type: 'list',
        name: 'plugin',
        message: 'Plugin name',
        async choices() {
          const pluginsPath = join(plop.getDestBasePath(), 'plugins');
          if (!(await fs.pathExists(pluginsPath))) throw new Error('Couldn\'t find a "plugins" directory');
          const dirs = (await fs.readdir(pluginsPath, { withFileTypes: true })).filter((fd) => fd.isDirectory());
          if (dirs.length === 0) throw new Error('The "plugins" directory is empty');
          return dirs;
        },
      },
    ],
    actions(answers) {
      if (!answers) return [];
      const filePath = answers.isPluginApi && answers.plugin ? 'plugins/{{ plugin }}' : 'api/{{ id }}';
      const lang = tsUtils.isUsingTypeScriptSync(process.cwd()) ? 'ts' : 'js';
      const base = [
        { type: 'add', path: `${filePath}/controllers/{{ id }}.${lang}`, templateFile: `templates/${lang}/controller.${lang}.hbs` },
        { type: 'add', path: `${filePath}/services/{{ id }}.${lang}`, templateFile: `templates/${lang}/service.${lang}.hbs` },
      ];
      return answers.isPluginApi ? base : [
        { type: 'add', path: `${filePath}/routes/{{ id }}.${lang}`, templateFile: `templates/${lang}/single-route.${lang}.hbs` },
        ...base,
      ];
    },
  });
};
