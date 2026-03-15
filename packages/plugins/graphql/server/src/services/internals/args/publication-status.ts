import { arg } from 'nexus';
import { Context } from '../../types';

export default ({ leao }: Context) => {
  const { PUBLICATION_STATUS_TYPE_NAME } = leao.plugin('graphql').service('constants');

  return arg({
    type: PUBLICATION_STATUS_TYPE_NAME,
    default: 'published',
  });
};
