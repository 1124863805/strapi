import { get, map, mapValues } from 'lodash/fp';
import type { Context } from '../../types';

export default ({ leao }: Context) => ({
  graphqlScalarToOperators(graphqlScalar: string) {
    const { GRAPHQL_SCALAR_OPERATORS } = leao.plugin('graphql').service('constants');
    const { operators } = leao.plugin('graphql').service('builders').filters;

    const associations = mapValues(
      map((operatorName: string) => operators[operatorName]),
      GRAPHQL_SCALAR_OPERATORS
    );

    return get(graphqlScalar, associations);
  },
});
