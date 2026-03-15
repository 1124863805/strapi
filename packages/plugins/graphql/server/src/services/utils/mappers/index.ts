import leaoScalarToGraphQLScalar from './leao-scalar-to-graphql-scalar';
import graphQLFiltersToLeaoQuery from './graphql-filters-to-leao-query';
import graphqlScalarToOperators from './graphql-scalar-to-operators';
import entityToResponseEntity from './entity-to-response-entity';

import type { Context } from '../../types';

export default (context: Context) => ({
  ...leaoScalarToGraphQLScalar(context),
  ...graphQLFiltersToLeaoQuery(context),
  ...graphqlScalarToOperators(context),
  ...entityToResponseEntity(),
});
