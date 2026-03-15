import type { PropertyPath } from 'lodash';
import type { Router, Controller, Service, Policy, Middleware, Leao } from '.';
import type { ContentType } from '../schema';

export interface Module {
  bootstrap: ({ leao }: { leao: Leao }) => void | Promise<void>;
  destroy: ({ leao }: { leao: Leao }) => void | Promise<void>;
  register: ({ leao }: { leao: Leao }) => void | Promise<void>;
  config<T = unknown>(key: PropertyPath, defaultVal?: T): T; // TODO: this mirrors ConfigProvider.get, we should use it directly
  routes: Record<string, Router>;
  controllers: Record<string, Controller>;
  services: Record<string, Service>;
  policies: Record<string, Policy>;
  middlewares: Record<string, Middleware>;
  contentTypes: Record<string, { schema: ContentType }>;

  controller<T extends Controller>(name: string): T;
  service<T extends Service>(name: string): T;
}
