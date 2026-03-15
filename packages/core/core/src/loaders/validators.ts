import type { Core } from '@leao/types';

export default (leao: Core.Leao) => {
  leao.get('validators').set('content-api', { input: [], query: [] });
};
