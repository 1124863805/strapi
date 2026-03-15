import type * as Nexus from 'nexus';

const NULL_FIELD_NAME = 'null';

export default () => ({
  fieldName: NULL_FIELD_NAME,

  leaoOperator: '$null',

  add(t: Nexus.blocks.ObjectDefinitionBlock<string>) {
    t.boolean(NULL_FIELD_NAME);
  },
});
