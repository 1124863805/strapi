import type { NodePlopAPI } from 'plop';
import tsUtils from '@leao1/config';
import getDestinationPrompts from './prompts/get-destination-prompts';
import getFilePath from './utils/get-file-path';
import validateInput from './utils/validate-input';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('middleware', {
    description: 'Generate a middleware for an API',
    prompts: [
      { type: 'input', name: 'name', message: 'Middleware name', validate: (input) => validateInput(input) },
      ...getDestinationPrompts('middleware', plop.getDestBasePath(), { rootFolder: true }),
    ],
    actions(answers) {
      if (!answers) return [];
      const filePath = getFilePath(answers.destination);
      const lang = tsUtils.isUsingTypeScriptSync(process.cwd()) ? 'ts' : 'js';
      return [{ type: 'add', path: `${filePath}/middlewares/{{ name }}.${lang}`, templateFile: `templates/${lang}/middleware.${lang}.hbs` }];
    },
  });
};
