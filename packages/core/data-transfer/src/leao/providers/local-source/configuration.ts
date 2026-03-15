import { Readable } from 'stream';
import { chain } from 'stream-chain';
import { set } from 'lodash/fp';
import type { Core } from '@leao/types';

import type { IConfiguration } from '../../../../types';

/**
 * Create a readable stream that export the Leao app configuration
 */
export const createConfigurationStream = (leao: Core.Leao): Readable => {
  return Readable.from(
    (async function* configurationGenerator(): AsyncGenerator<IConfiguration> {
      // Core Store
      const coreStoreStream = chain([
        leao.db.queryBuilder('leao::core-store').stream(),
        (data) => set('value', JSON.parse(data.value), data),
        wrapConfigurationItem('core-store'),
      ]);

      // Webhook
      const webhooksStream = chain([
        leao.db.queryBuilder('leao::webhook').stream(),
        wrapConfigurationItem('webhook'),
      ]);

      const streams = [coreStoreStream, webhooksStream];

      for (const stream of streams) {
        for await (const item of stream) {
          yield item;
        }
      }
    })()
  );
};

const wrapConfigurationItem = (type: 'core-store' | 'webhook') => (value: unknown) => ({
  type,
  value,
});
