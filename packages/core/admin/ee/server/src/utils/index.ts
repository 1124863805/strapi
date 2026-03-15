import type { Core } from '@leao/types';

export const getService = (
  name: string,
  { leao }: { leao: Core.Leao } = { leao: global.leao }
) => {
  return leao.service(`admin::${name}`);
};

export default {
  getService,
};
