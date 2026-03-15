import type { Core } from '@leao/types';
import { createAPI } from './api';

const createAdminAPI = (leao: Core.Leao) => {
  const opts = {
    prefix: '', // '/admin';
    type: 'admin',
  };

  return createAPI(leao, opts);
};

export { createAdminAPI };
