import type { DynamicPromptsFunction } from 'node-plop';
import validateAttributeInput from '../utils/validate-attribute-input';

const ATTRIBUTE_TYPES = [
  'media', 'string', 'text', 'richtext', 'json', 'enumeration', 'password',
  'email', 'integer', 'biginteger', 'float', 'decimal', 'date', 'time',
  'datetime', 'timestamp', 'boolean',
] as const;

interface AttributeAnswer {
  attributeName: string;
  attributeType: (typeof ATTRIBUTE_TYPES)[number];
  enum?: string;
  multiple?: boolean;
  addAttributes?: boolean;
}

const getAttributesPrompts: DynamicPromptsFunction = async (inquirer) => {
  const { addAttributes } = await inquirer.prompt([
    { type: 'confirm', name: 'addAttributes', message: 'Do you want to add attributes?' },
  ]);

  const attributes: AttributeAnswer[] = [];

  const createNewAttributes = async (inq: Parameters<DynamicPromptsFunction>[0]) => {
    const answers = await inq.prompt([
      {
        type: 'input',
        name: 'attributeName',
        message: 'Name of attribute',
        validate: (input: string) => validateAttributeInput(input),
      },
      {
        type: 'list',
        name: 'attributeType',
        message: 'What type of attribute',
        pageSize: ATTRIBUTE_TYPES.length,
        choices: ATTRIBUTE_TYPES.map((t) => ({ name: t, value: t })),
      },
      {
        when: (a) => a?.attributeType === 'enumeration',
        type: 'input',
        name: 'enum',
        message: 'Add values separated by a comma',
      },
      {
        when: (a) => a?.attributeType === 'media',
        type: 'list',
        name: 'multiple',
        message: 'Choose media type',
        choices: [
          { name: 'Multiple', value: true },
          { name: 'Single', value: false },
        ],
      },
      {
        type: 'confirm',
        name: 'addAttributes',
        message: 'Do you want to add another attribute?',
      },
    ]);

    attributes.push(answers as AttributeAnswer);
    if ((answers as AttributeAnswer).addAttributes) await createNewAttributes(inq);
  };

  if (addAttributes) {
    await createNewAttributes(inquirer);
  } else {
    console.warn(
      'You won\'t be able to manage entries from the admin, you can still add attributes later from the content type builder.'
    );
  }

  return attributes;
};

export default getAttributesPrompts;
