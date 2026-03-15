import type { Plugin } from '@leao1/types';
import { createHistoryService } from './history';
import { createLifecyclesService } from './lifecycles';

export const services = {
  history: createHistoryService,
  lifecycles: createLifecyclesService,
} satisfies Plugin.LoadedPlugin['services'];
