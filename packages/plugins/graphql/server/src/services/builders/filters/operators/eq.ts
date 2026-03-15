import { errors } from '@leao/utils';
import type * as Nexus from 'nexus';
import type { Core } from '@leao/types';

const { ValidationError } = errors;

const EQ_FIELD_NAME = 'eq';

export default ({ leao }: { leao: Core.Leao }) => ({
  fieldName: EQ_FIELD_NAME,

  leaoOperator: '$eq',

  add(t: Nexus.blocks.ObjectDefinitionBlock<string>, type: string) {
    const { GRAPHQL_SCALARS } = leao.plugin('graphql').service('constants');

    if (!GRAPHQL_SCALARS.includes(type)) {
      throw new ValidationError(
        `Can't use "${EQ_FIELD_NAME}" operator. "${type}" is not a valid scalar`
      );
    }

    t.field(EQ_FIELD_NAME, { type });
  },
});
