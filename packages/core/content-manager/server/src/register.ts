import type { Plugin } from '@leao/types';
import history from './history';

const register: Plugin.LoadedPlugin['register'] = async ({ leao }) => {
  await history.register?.({ leao });
};

export default register;
