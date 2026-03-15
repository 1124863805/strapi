import type { Core } from '@leao/types';

type HistoryServices = typeof import('./services').services;

function getService<T extends keyof HistoryServices>(leao: Core.Leao, name: T) {
  // Cast is needed because the return type of leao.service is too vague
  return leao.service(`plugin::content-manager.${name}`) as ReturnType<HistoryServices[T]>;
}

export { getService };
