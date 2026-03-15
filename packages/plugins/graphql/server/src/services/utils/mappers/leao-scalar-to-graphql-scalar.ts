import { get, difference } from 'lodash/fp';
import { errors } from '@leao1/utils';
import type { Context } from '../../types';

const { ApplicationError } = errors;

export default ({ leao }: Context) => {
  const { LEAO_SCALARS, SCALARS_ASSOCIATIONS } = leao.plugin('graphql').service('constants');

  const missingLeaoScalars = difference(LEAO_SCALARS, Object.keys(SCALARS_ASSOCIATIONS));

  if (missingLeaoScalars.length > 0) {
    throw new ApplicationError('Some Leao scalars are not handled in the GraphQL scalars mapper');
  }

  return {
    /**
     * Used to transform a Leao scalar type into its GraphQL equivalent
     */
    leaoScalarToGraphQLScalar(leaoScalar: string) {
      return get(leaoScalar, SCALARS_ASSOCIATIONS);
    },
  };
};
