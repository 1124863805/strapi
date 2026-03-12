import type { StrapiConfig } from './types';

export const config: StrapiConfig = {
  default: {
    provider: 'sendmail',
    providerOptions: {},
    settings: {
      defaultFrom: 'No-Reply <no-reply@example.com>',
    },
  },
  validator() {},
};
