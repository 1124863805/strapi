import type * as Nexus from 'nexus';
import type { Core } from '@leao1/types';

const NOT_FIELD_NAME = 'not';

export default ({ leao }: { leao: Core.Leao }) => ({
  fieldName: NOT_FIELD_NAME,

  leaoOperator: '$not',

  add(t: Nexus.blocks.ObjectDefinitionBlock<string>, type: string) {
    const { naming, attributes } = leao.plugin('graphql').service('utils');

    if (attributes.isGraphQLScalar({ type })) {
      t.field(NOT_FIELD_NAME, { type: naming.getScalarFilterInputTypeName(type) });
    } else {
      t.field(NOT_FIELD_NAME, { type });
    }
  },
});
