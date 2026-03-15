import { objectType } from 'nexus';
import type { Context } from '../../types';

export default ({ leao }: Context) => {
  const { DELETE_MUTATION_RESPONSE_TYPE_NAME } = leao.plugin('graphql').service('constants');

  return {
    DeleteMutationResponse: objectType({
      name: DELETE_MUTATION_RESPONSE_TYPE_NAME,

      definition(t) {
        t.nonNull.id('documentId');
      },
    }),
  };
};
