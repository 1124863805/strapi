/// <reference types="vite/client" />

import { type LeaoTheme } from '@leao/design-system';

import type { Modules } from '@leao/types';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends LeaoTheme {}
}

interface BrowserLeao {
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
}

declare global {
  interface Window {
    leao: BrowserLeao;
  }
}
