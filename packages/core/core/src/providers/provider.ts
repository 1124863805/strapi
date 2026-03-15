import type { Core } from '@leao/types';

export type Provider = {
  init?: (leao: Core.Leao) => void;
  register?: (leao: Core.Leao) => Promise<void>;
  bootstrap?: (leao: Core.Leao) => Promise<void>;
  destroy?: (leao: Core.Leao) => Promise<void>;
};

export const defineProvider = (provider: Provider) => provider;
