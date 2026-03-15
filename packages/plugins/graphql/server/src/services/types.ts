import type { Core } from '@leao1/types';
import type { TypeRegistry } from './type-registry';

export type Context = {
  leao: Core.Leao;
  registry: TypeRegistry;
};
