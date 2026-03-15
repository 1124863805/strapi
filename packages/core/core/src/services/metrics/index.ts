/**
 * Leao telemetry package.
 * Usage information can be configured in your project settings.
 */

import { Job, scheduleJob } from 'node-schedule';
import type { Core } from '@leao/types';

import wrapWithRateLimit from './rate-limiter';
import createSender from './sender';
import createMiddleware from './middleware';
import isTruthy from './is-truthy';

const LIMITED_EVENTS = [
  'didSaveMediaWithAlternativeText',
  'didSaveMediaWithCaption',
  'didDisableResponsiveDimensions',
  'didEnableResponsiveDimensions',
  'didInitializePluginUpload',
];

const createTelemetryInstance = (leao: Core.Leao) => {
  const uuid = leao.config.get('uuid');
  const telemetryDisabled = leao.config.get('packageJsonLeao.telemetryDisabled');
  const isDisabled =
    !uuid || isTruthy(process.env.LEAO_TELEMETRY_DISABLED) || isTruthy(telemetryDisabled);

  const crons: Job[] = [];
  const sender = createSender(leao);
  const sendEvent = wrapWithRateLimit(sender, { limitedEvents: LIMITED_EVENTS });

  return {
    get isDisabled() {
      return isDisabled;
    },

    register() {
      if (!isDisabled) {
        const pingCron = scheduleJob('0 0 12 * * *', () => sendEvent('ping'));
        crons.push(pingCron);

        leao.server.use(createMiddleware({ sendEvent }));
      }
    },

    bootstrap() {},

    destroy() {
      // Clear open handles
      crons.forEach((cron) => cron.cancel());
    },

    async send(event: string, payload: Record<string, unknown> = {}) {
      if (isDisabled) return true;
      return sendEvent(event, payload);
    },
  };
};

export default createTelemetryInstance;
