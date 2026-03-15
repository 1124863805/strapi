import type { Core } from '@leao/types';

export default (leao: Core.Leao) => {
  leao.get('sanitizers').set('content-api', { input: [], output: [], query: [] });
};
