import type { NodePlopAPI } from 'plop';
import tsUtils from '@leao1/config';
import getDestinationPrompts from './prompts/get-destination-prompts';
import getFilePath from './utils/get-file-path';
import validateInput from './utils/validate-input';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('policy', {
    description: 'Generate a policy for an API',
    prompts: [
      { type: 'input', name: 'id', message: 'Policy name', validate: (input) => validateInput(input) },
      ...getDestinationPrompts('policy', plop.getDestBasePath(), { rootFolder: true }),
    ],
    actions(answers) {
      if (!answers) return [];
      const filePath = getFilePath(answers.destination);
      const lang = tsUtils.isUsingTypeScriptSync(process.cwd()) ? 'ts' : 'js';
      return [{ type: 'add', path: `${filePath}/policies/{{ id }}.${lang}`, templateFile: `templates/${lang}/policy.${lang}.hbs` }];
    },
  });
};
