/**
 * EE features configuration. No external validation.
 */

interface EEInfo {
  type: string;
  expireAt?: string;
  seats?: number;
  features?: Array<{ name: string; options?: Record<string, unknown> }>;
}

const DEFAULT_FEATURES = [
  { name: 'sso' },
  { name: 'audit-logs', options: { retentionDays: null } },
  { name: 'review-workflows' },
  { name: 'cms-content-releases' },
  { name: 'cms-content-history', options: { retentionDays: 99999 } },
];

export const getDefaultEEInfo = (): EEInfo => ({
  type: 'gold',
  expireAt: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
  seats: 99999,
  features: Object.freeze([...DEFAULT_FEATURES]) as EEInfo['features'],
});
