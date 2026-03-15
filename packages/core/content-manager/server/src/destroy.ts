import type { Plugin } from '@leao/types';
import history from './history';

const destroy: Plugin.LoadedPlugin['destroy'] = async ({ leao }) => {
  await history.destroy?.({ leao });
};

export default destroy;
