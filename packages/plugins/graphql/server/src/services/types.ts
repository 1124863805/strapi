import type { Core } from '@leao/types';
import type { TypeRegistry } from './type-registry';

export type Context = {
  leao: Core.Leao;
  registry: TypeRegistry;
};
