import type { LeaoConfig } from './types';

export const config: LeaoConfig = {
  default: {
    provider: 'sendmail',
    providerOptions: {},
    settings: {
      defaultFrom: 'No-Reply <no-reply@example.com>',
    },
  },
  validator() {},
};
