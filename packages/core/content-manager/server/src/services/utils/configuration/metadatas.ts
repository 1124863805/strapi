import _ from 'lodash';
import { getService } from '../../../utils';
import {
  isSortable,
  isSearchable,
  isVisible,
  isListable,
  isRelation,
  getDefaultMainField,
} from './attributes';
import {
  SYSTEM_FIELDS,
  CONTENT_TYPE_SYSTEM_FIELDS,
  SYSTEM_FIELD_METADATAS,
} from './constants';

function createDefaultMetadatas(schema: any) {
  const systemFieldKeys =
    schema.modelType === 'contentType' ? CONTENT_TYPE_SYSTEM_FIELDS : [SYSTEM_FIELDS.ID];
  const systemFields = Object.fromEntries(
    systemFieldKeys.map((k) => [k, SYSTEM_FIELD_METADATAS[k]])
  );
  const schemaKeys = Object.keys(schema.attributes).filter(
    (k) => !systemFieldKeys.includes(k as any)
  );
  return {
    ...schemaKeys.reduce((acc: any, name) => {
      acc[name] = createDefaultMetadata(schema, name);
      return acc;
    }, {}),
    ...systemFields,
  };
}

function createDefaultMetadata(schema: any, name: any) {
  const edit = {
    label: name,
    description: '',
    placeholder: '',
    visible: isVisible(schema, name),
    editable: true,
  } as any;

  const fieldAttributes = schema.attributes[name];
  if (isRelation(fieldAttributes)) {
    const { targetModel } = fieldAttributes;

    const targetSchema = getTargetSchema(targetModel);

    if (targetSchema) {
      edit.mainField = getDefaultMainField(targetSchema);
    }
  }

  _.assign(
    edit,
    _.pick(_.get(schema, ['config', 'metadatas', name, 'edit'], {}), [
      'label',
      'description',
      'placeholder',
      'visible',
      'editable',
      'mainField',
    ])
  );

  const list = {
    // @ts-expect-error we need to specify these properties
    label: name,
    // @ts-expect-error we need to specify these properties
    searchable: isSearchable(schema, name),
    // @ts-expect-error we need to specify these properties
    sortable: isSortable(schema, name),
    ..._.pick(_.get(schema, ['config', 'metadatas', name, 'list'], {}), [
      'label',
      'searchable',
      'sortable',
    ]),
  };

  return { edit, list };
}

/** Synchronisation functions */

async function syncMetadatas(configuration: any, schema: any) {
  // clear all keys that do not exist anymore
  if (_.isEmpty(configuration.metadatas)) {
    return createDefaultMetadatas(schema);
  }

  // include schema attributes + content-type system fields (id, documentId)
  const validKeys = new Set([
    ...Object.keys(schema.attributes),
    ...(schema.modelType === 'contentType' ? CONTENT_TYPE_SYSTEM_FIELDS : [SYSTEM_FIELDS.ID]),
  ]);
  const metasWithValidKeys = _.pick(configuration.metadatas, [...validKeys]);

  // add new keys and missing fields
  const metasWithDefaults = _.merge({}, createDefaultMetadatas(schema), metasWithValidKeys);

  // clear the invalid mainFields
  const updatedMetas = Object.keys(metasWithDefaults).reduce((acc, key) => {
    const { edit, list } = metasWithDefaults[key];
    const attr = schema.attributes[key];

    const updatedMeta = { edit, list };

    if (!attr && (key === SYSTEM_FIELDS.ID || key === SYSTEM_FIELDS.DOCUMENT_ID)) {
      return acc;
    }
    // update sortable attr
    if (list.sortable && !isSortable(schema, key)) {
      _.set(updatedMeta, ['list', 'sortable'], false);
      _.set(acc, [key], updatedMeta);
    }

    if (list.searchable && !isSearchable(schema, key)) {
      _.set(updatedMeta, ['list', 'searchable'], false);
      _.set(acc, [key], updatedMeta);
    }

    if (!_.has(edit, 'mainField')) return acc;

    if (!attr || !isRelation(attr)) {
      _.set(updatedMeta, 'edit', _.omit(edit, ['mainField']));
      _.set(acc, [key], updatedMeta);
      return acc;
    }

    if (edit.mainField === SYSTEM_FIELDS.ID) return acc;

    // check the mainField in the targetModel
    const targetSchema = getTargetSchema(attr.targetModel);

    if (!targetSchema) return acc;

    if (!isSortable(targetSchema, edit.mainField) && !isListable(targetSchema, edit.mainField)) {
      _.set(updatedMeta, ['edit', 'mainField'], getDefaultMainField(targetSchema));
      _.set(acc, [key], updatedMeta);
      return acc;
    }

    return acc;
  }, {});

  return _.assign(metasWithDefaults, updatedMetas);
}

const getTargetSchema = (targetModel: any) => {
  return getService('content-types').findContentType(targetModel);
};

export { createDefaultMetadatas, syncMetadatas };
