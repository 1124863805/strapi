import type { Logger } from '@strapi/logger';

import { getDefaultEEInfo } from './features';

interface EE {
  enabled: boolean;
  info: {
    features?: Array<{ name: string; [key: string]: any } | string>;
    seats?: number;
  };
  logger?: Logger;
}

const ee: EE = {
  enabled: false,
  info: {},
};

const enable = () => {
  const shouldEmitEvent = ee.enabled !== true;
  ee.enabled = true;
  if (shouldEmitEvent && (global as any).strapi?.eventHub) {
    (global as any).strapi.eventHub.emit('ee.enable');
  }
};

let initialized = false;

const init = (_dir: string, logger?: Logger) => {
  if (initialized) return;
  initialized = true;
  ee.logger = logger;

  if (process.env.STRAPI_DISABLE_EE?.toLowerCase() === 'true') return;

  ee.info = getDefaultEEInfo();
  enable();
};

const list = () =>
  ee.info.features?.map((f) => (typeof f === 'object' ? f : { name: f })) || [];

const get = (name: string) => list().find((f) => f.name === name);

export default Object.freeze({
  init,

  get isEE() {
    return ee.enabled;
  },

  get seats() {
    return ee.info.seats;
  },

  features: Object.freeze({
    list,
    get,
    isEnabled: (name: string) => get(name) !== undefined,
  }),
});
