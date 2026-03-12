import type { Core } from '@strapi/types';

export interface Payload {
  eventProperties?: Record<string, unknown>;
  userProperties?: Record<string, unknown>;
  groupProperties?: Record<string, unknown>;
}

export type Sender = (
  event: string,
  payload?: Payload,
  opts?: Record<string, unknown>
) => Promise<boolean>;

/**
 * Disabled: no telemetry sent to external servers
 */
export default (_strapi: Core.Strapi): Sender => {
  return async () => true;
};
