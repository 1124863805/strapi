import { queryParams } from '@leao1/utils';
import type { Core, UID } from '@leao1/types';

export default (leao: Core.Leao) => {
  const { transformQueryParams } = queryParams.createTransformer({
    getModel: (uid: string) => leao.getModel(uid as UID.Schema),
  });

  return {
    transform: transformQueryParams,
  };
};
