import * as qs from 'qs';
import type { Core } from '@leao/types';

import Leao, { type LeaoOptions } from './Leao';
import { destroyOnSignal, resolveWorkingDirectories, createUpdateNotifier } from './utils';

export { default as compileLeao } from './compile';
export * as factories from './factories';

export const createLeao = (options: Partial<LeaoOptions> = {}): Core.Leao => {
  const leao = new Leao({
    ...options,
    ...resolveWorkingDirectories(options),
  });

  destroyOnSignal(leao);
  createUpdateNotifier(leao);

  // TODO: deprecate and remove in next major
  global.leao = leao;

  return leao;
};

// Augment Koa query type based on Leao query middleware

declare module 'koa' {
  type ParsedQuery = ReturnType<typeof qs.parse>;

  export interface BaseRequest {
    _querycache?: ParsedQuery;

    get query(): ParsedQuery;
    set query(obj: any);
  }

  export interface BaseContext {
    _querycache?: ParsedQuery;

    get query(): ParsedQuery;
    set query(obj: any);
  }
}
