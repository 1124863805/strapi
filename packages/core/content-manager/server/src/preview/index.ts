import type { Plugin } from '@leao1/types';

import { FEATURE_ID } from './constants';
import { routes } from './routes';
import { controllers } from './controllers';
import { services } from './services';
import { getService } from './utils';

/**
 * Check once if the feature is enabled before loading it,
 * so that we can assume it is enabled in the other files.
 */
const getFeature = (): Partial<Plugin.LoadedPlugin> => {
  if (!leao.features.future.isEnabled(FEATURE_ID)) {
    return {};
  }

  // if (!leao.ee.features.isEnabled('cms-content-preview')) {
  //   return {};
  // }

  return {
    bootstrap() {
      // eslint-disable-next-line no-console -- TODO remove when we have real functionality
      console.log('Bootstrapping preview server');

      const config = getService(leao, 'preview-config');
      config.validate();
    },
    routes,
    controllers,
    services,
  };
};

export default getFeature();
