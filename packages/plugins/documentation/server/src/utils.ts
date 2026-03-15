import type { Core } from '@leao1/types';

import type { Services } from './services';

export const getService = <TName extends keyof Services>(
  name: TName,
  { leao }: { leao: Core.Leao } = { leao: global.leao }
): Services[TName] => {
  return leao.plugin('documentation').service<Services[TName]>(name);
};

export default {
  getService,
};
