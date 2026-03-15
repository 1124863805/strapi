import type { Core } from '@leao1/types';

import { ProviderInitializationError } from '../errors/providers';

export type ValidLeaoAssertion = (leao: unknown, msg?: string) => asserts leao is Core.Leao;

export const assertValidLeao: ValidLeaoAssertion = (leao?: unknown, msg = '') => {
  if (!leao) {
    throw new ProviderInitializationError(`${msg}. Leao instance not found.`);
  }
};
