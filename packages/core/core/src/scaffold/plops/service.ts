import type { NodePlopAPI } from 'plop';
import tsUtils from '@leao1/config';
import getDestinationPrompts from './prompts/get-destination-prompts';
import getFilePath from './utils/get-file-path';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('service', {
    description: 'Generate a service for an API',
    prompts: [
      { type: 'input', name: 'id', message: 'Service name' },
      ...getDestinationPrompts('service', plop.getDestBasePath()),
    ],
    actions(answers) {
      if (!answers) return [];
      const filePath = getFilePath(answers.destination);
      const lang = tsUtils.isUsingTypeScriptSync(process.cwd()) ? 'ts' : 'js';
      return [{ type: 'add', path: `${filePath}/services/{{ id }}.${lang}`, templateFile: `templates/${lang}/service.${lang}.hbs` }];
    },
  });
};
