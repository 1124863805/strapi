import type { Core } from '@leao1/types';

type InputAttributes = {
  [key: string]: {
    type: string;
    customField?: string;
  };
};

export const convertCustomFieldType = (leao: Core.Leao) => {
  const allContentTypeSchemaAttributes = Object.values(leao.contentTypes).map(
    (schema) => schema.attributes
  );

  const allComponentSchemaAttributes = Object.values(leao.components).map(
    (schema) => schema.attributes
  );
  const allSchemasAttributes: InputAttributes[] = [
    ...allContentTypeSchemaAttributes,
    ...allComponentSchemaAttributes,
  ];

  for (const schemaAttrbutes of allSchemasAttributes) {
    for (const attribute of Object.values(schemaAttrbutes)) {
      if (attribute.type === 'customField') {
        const customField = leao.get('custom-fields').get(attribute.customField);
        attribute.type = customField.type;
      }
    }
  }
};
