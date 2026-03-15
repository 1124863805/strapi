import type { Core } from '@leao1/types';
import { createAPI } from './api';

const createContentAPI = (leao: Core.Leao) => {
  const opts = {
    prefix: leao.config.get('api.rest.prefix', '/api'),
    type: 'content-api',
  };

  return createAPI(leao, opts);
};

export { createContentAPI };
