import type { Core } from '@leao1/types';

export default (leao: Core.Leao) => {
  leao.get('validators').set('content-api', { input: [], query: [] });
};
