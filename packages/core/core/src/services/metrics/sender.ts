import type { Core } from '@leao/types';

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
export default (_leao: Core.Leao): Sender => {
  return async () => true;
};
