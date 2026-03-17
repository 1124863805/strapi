import pluralize from 'pluralize';
import slugify from '@sindresorhus/slugify';
import { strings } from '@leao1/utils';
import type { PromptQuestion } from 'node-plop';

interface Answers {
  displayName: string;
  singularName: string;
  pluralName: string;
}

const questions: PromptQuestion[] = [
  {
    type: 'input',
    name: 'displayName',
    message: 'Content type display name',
    validate: (input: string) => !!input,
  },
  {
    type: 'input',
    name: 'singularName',
    message: 'Content type singular name',
    default: (answers: Answers) => slugify(answers.displayName),
    validate: (input: string) => (strings.isKebabCase(input) ? true : 'Value must be in kebab-case'),
  },
  {
    type: 'input',
    name: 'pluralName',
    message: 'Content type plural name',
    default: (answers: Answers) => pluralize(answers.singularName),
    validate: (input: string, answers?: Answers) => {
      if (answers?.singularName === input) return 'Singular and plural names cannot be the same';
      return strings.isKebabCase(input) ? true : 'Value must be in kebab-case';
    },
  },
];

export default questions;
