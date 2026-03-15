import type { Core } from '@leao1/types';

import loadSrcIndex from './src-index';
import loadAPIs from './apis';
import loadMiddlewares from './middlewares';
import loadComponents from './components';
import loadPolicies from './policies';
import loadPlugins from './plugins';
import loadSanitizers from './sanitizers';
import loadValidators from './validators';

export async function loadApplicationContext(leao: Core.Leao) {
  await Promise.all([
    loadSrcIndex(leao),
    loadSanitizers(leao),
    loadValidators(leao),
    loadPlugins(leao),
    loadAPIs(leao),
    loadComponents(leao),
    loadMiddlewares(leao),
    loadPolicies(leao),
  ]);
}
