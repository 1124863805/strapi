import { type LeaoTheme } from '@leao1/design-system';

import type { Modules } from '@leao1/types';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends LeaoTheme {}
}

declare global {
  interface Window {
    leao: {
      backendURL: string;
      isEE: boolean;
      future: {
        isEnabled: (name: keyof NonNullable<Modules.Features.FeaturesConfig['future']>) => boolean;
      };
      features: {
        SSO: 'sso';
        AUDIT_LOGS: 'audit-logs';
        REVIEW_WORKFLOWS: 'review-workflows';
        isEnabled: (featureName?: string) => boolean;
      };
      flags: {
        promoteEE?: boolean;
      };
      projectType: 'Community' | 'Enterprise';
    };
  }
}
