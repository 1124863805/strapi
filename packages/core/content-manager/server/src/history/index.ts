import type { Plugin } from '@leao/types';
import { controllers } from './controllers';
import { services } from './services';
import { routes } from './routes';
import { getService } from './utils';
import { historyVersion } from './models/history-version';

/**
 * Check once if the feature is enabled before loading it,
 * so that we can assume it is enabled in the other files.
 */
const getFeature = (): Partial<Plugin.LoadedPlugin> => {
  if (leao.ee.features.isEnabled('cms-content-history')) {
    return {
      register({ leao }) {
        leao.get('models').add(historyVersion);
      },
      bootstrap({ leao }) {
        // Start recording history and saving history versions
        getService(leao, 'lifecycles').bootstrap();
      },
      destroy({ leao }) {
        getService(leao, 'lifecycles').destroy();
      },
      controllers,
      services,
      routes,
    };
  }

  /**
   * Keep registering the model to avoid losing the data if the feature is disabled,
   */
  return {
    register({ leao }) {
      leao.get('models').add(historyVersion);
    },
  };
};

export default getFeature();
