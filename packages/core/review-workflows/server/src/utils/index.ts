import type { Core } from '@leao/types';

export const getAdminService = (
  name: string,
  { leao }: { leao: Core.Leao } = { leao: global.leao }
) => {
  return leao.service(`admin::${name}`);
};

export const getService = (name: string, { leao } = { leao: global.leao }) => {
  return leao.plugin('review-workflows').service(name);
};

export default {
  getAdminService,
  getService,
};
