import { join } from 'node:path';
import type { NodePlopAPI, ActionType } from 'plop';
import slugify from '@sindresorhus/slugify';
import fs from 'fs-extra';
import { strings } from '@leao1/utils';
import tsUtils from '@leao1/config';
import getDestinationPrompts from './prompts/get-destination-prompts';
import getFilePath from './utils/get-file-path';
import ctNamesPrompts from './prompts/ct-names-prompts';
import kindPrompts from './prompts/kind-prompts';
import getAttributesPrompts from './prompts/get-attributes-prompts';
import bootstrapApiPrompts from './prompts/bootstrap-api-prompts';

export default (plop: NodePlopAPI) => {
  plop.setGenerator('content-type', {
    description: 'Generate a content type for an API',
    async prompts(inquirer) {
      const config = await inquirer.prompt([...ctNamesPrompts, ...kindPrompts]);
      const attributes = await getAttributesPrompts(inquirer);
      const api = await inquirer.prompt([
        ...getDestinationPrompts('model', plop.getDestBasePath()),
        {
          when: (answers) => answers?.destination === 'new',
          type: 'input',
          name: 'id',
          default: config.singularName,
          message: 'Name of the new API?',
          async validate(input: string) {
            if (!strings.isKebabCase(input)) return 'Value must be in kebab-case';
            const apiPath = join(plop.getDestBasePath(), 'api');
            if (!(await fs.pathExists(apiPath))) return true;
            const dirs = (await fs.readdir(apiPath, { withFileTypes: true })).filter((fd) => fd.isDirectory());
            if (dirs.some((d) => d.name === input)) throw new Error('This name is already taken.');
            return true;
          },
        },
        ...bootstrapApiPrompts,
      ]);
      return { ...config, ...api, attributes };
    },
    actions(answers) {
      if (!answers) return [];
      const filePath = getFilePath(answers.destination);
      const lang = tsUtils.isUsingTypeScriptSync(process.cwd()) ? 'ts' : 'js';

      const attributes = (answers.attributes || []).reduce((acc: Record<string, unknown>, a: { attributeName: string; attributeType: string; enum?: string; multiple?: boolean }) => {
        const val: Record<string, unknown> = { type: a.attributeType };
        if (a.attributeType === 'enumeration') val.enum = a.enum?.split(',').map((s) => s.trim());
        if (a.attributeType === 'media') {
          val.allowedTypes = ['images', 'files', 'videos', 'audios'];
          val.multiple = a.multiple;
        }
        return { ...acc, [a.attributeName]: val };
      }, {});

      const baseActions: ActionType[] = [
        {
          type: 'add',
          path: `${filePath}/content-types/{{ singularName }}/schema.json`,
          templateFile: `templates/${lang}/content-type.schema.json.hbs`,
          data: { collectionName: slugify(answers.pluralName, { separator: '_' }) },
        },
      ];

      if (Object.keys(attributes).length > 0) {
        baseActions.push({
          type: 'modify',
          path: `${filePath}/content-types/{{ singularName }}/schema.json`,
          transform(template: string) {
            const parsed = JSON.parse(template);
            parsed.attributes = attributes;
            return JSON.stringify(parsed, null, 2);
          },
        });
      }

      if (answers.bootstrapApi) {
        const uid = answers.destination === 'new'
          ? `api::${answers.id}.${answers.singularName}`
          : answers.api
            ? `api::${answers.api}.${answers.singularName}`
            : `plugin::${answers.plugin}.${answers.singularName}`;
        baseActions.push(
          {
            type: 'add',
            path: `${filePath}/controllers/{{ singularName }}.${lang}`,
            templateFile: `templates/${lang}/core-controller.${lang}.hbs`,
            data: { uid },
          },
          {
            type: 'add',
            path: `${filePath}/services/{{ singularName }}.${lang}`,
            templateFile: `templates/${lang}/core-service.${lang}.hbs`,
            data: { uid },
          },
          {
            type: 'add',
            path: `${filePath}/routes/{{ singularName }}.${lang}`,
            templateFile: `templates/${lang}/core-router.${lang}.hbs`,
            data: { uid },
          }
        );
      }

      return baseActions;
    },
  });
};
