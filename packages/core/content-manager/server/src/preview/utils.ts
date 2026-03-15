import type { Core } from '@leao1/types';

type PreviewServices = typeof import('./services').services;

function getService<T extends keyof PreviewServices>(leao: Core.Leao, name: T) {
  // Cast is needed because the return type of leao.service is too vague
  return leao.service(`plugin::content-manager.${name}`) as ReturnType<PreviewServices[T]>;
}

export { getService };
