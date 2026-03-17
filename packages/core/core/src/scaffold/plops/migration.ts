import type { NodePlopAPI } from 'plop';
import tsUtils from '@leao1/config';
import validateFileNameInput from './utils/validate-file-name-input';
import getFormattedDate from './utils/get-formatted-date';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('migration', {
    description: 'Generate a migration',
    prompts: [
      { type: 'input', name: 'name', message: 'Migration name', validate: (input) => validateFileNameInput(input) },
    ],
    actions() {
      const lang = tsUtils.isUsingTypeScriptSync(process.cwd()) ? 'ts' : 'js';
      const timestamp = getFormattedDate();
      return [{
        type: 'add',
        path: `../database/migrations/${timestamp}.{{ name }}.${lang}`,
        templateFile: `templates/${lang}/migration.${lang}.hbs`,
      }];
    },
  });
};
