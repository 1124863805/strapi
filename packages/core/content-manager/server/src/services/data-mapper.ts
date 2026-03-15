import { pick, getOr } from 'lodash/fp';
import { contentTypes as contentTypesUtils } from '@leao/utils';

import type { Schema, Struct } from '@leao/types';

import { SYSTEM_FIELDS, SYSTEM_FIELD_ATTRIBUTES } from './utils/configuration/constants';

const dtoFields = [
  'uid',
  'isDisplayed',
  'apiID',
  'kind',
  'category',
  'info',
  'options',
  'pluginOptions',
  'attributes',
  'pluginOptions',
];

export default () => ({
  toContentManagerModel(contentType: Struct.Schema) {
    const baseAttributes: Record<string, { type: string }> = {
      [SYSTEM_FIELDS.ID]: SYSTEM_FIELD_ATTRIBUTES[SYSTEM_FIELDS.ID],
    };
    if ('modelType' in contentType && contentType.modelType === 'contentType') {
      baseAttributes[SYSTEM_FIELDS.DOCUMENT_ID] =
        SYSTEM_FIELD_ATTRIBUTES[SYSTEM_FIELDS.DOCUMENT_ID];
    }
    return {
      ...contentType,
      apiID: contentType.modelName,
      isDisplayed: isVisible(contentType),
      attributes: {
        ...baseAttributes,
        ...formatAttributes(contentType),
      },
    };
  },

  toDto: pick(dtoFields),
});

const formatAttributes = (contentType: Struct.Schema) => {
  const { getVisibleAttributes, getTimestamps, getCreatorFields } = contentTypesUtils;

  // only get attributes that can be seen in the auto generated Edit view or List view
  return getVisibleAttributes(contentType)
    .concat(getTimestamps(contentType))
    .concat(getCreatorFields(contentType))
    .reduce((acc: any, key: string) => {
      const attribute = contentType.attributes[key];

      // ignore morph until they are handled in the front
      if (attribute.type === 'relation' && attribute.relation.toLowerCase().includes('morph')) {
        return acc;
      }

      acc[key] = formatAttribute(key, attribute);
      return acc;
    }, {});
};

// FIXME: not needed
const formatAttribute = (key: any, attribute: Schema.Attribute.AnyAttribute) => {
  if (attribute.type === 'relation') {
    return toRelation(attribute);
  }

  return attribute;
};

// FIXME: not needed
const toRelation = (attribute: Schema.Attribute.Relation) => {
  return {
    ...attribute,
    type: 'relation',
    targetModel: 'target' in attribute ? attribute.target : undefined,
    relationType: attribute.relation,
  };
};

const isVisible = (model: Struct.Schema): boolean =>
  getOr(true, 'pluginOptions.content-manager.visible', model) === true;
