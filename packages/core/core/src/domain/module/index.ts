import _, { type PropertyPath, flatten } from 'lodash';
import { yup } from '@leao1/utils';
import type { Core, UID, Struct } from '@leao1/types';

import { removeNamespace } from '../../registries/namespace';
import { validateModule } from './validation';

interface LifecyclesState {
  bootstrap?: boolean;
  register?: boolean;
  destroy?: boolean;
}

export interface RawModule {
  config?: Record<string, unknown>;
  routes?: Core.Module['routes'];
  controllers?: Core.Module['controllers'];
  services?: Core.Module['services'];
  contentTypes?: Core.Module['contentTypes'];
  policies?: Core.Module['policies'];
  middlewares?: Core.Module['middlewares'];
  bootstrap?: (params: { leao: Core.Leao }) => Promise<void>;
  register?: (params: { leao: Core.Leao }) => Promise<void>;
  destroy?: (params: { leao: Core.Leao }) => Promise<void>;
}

export interface Module {
  bootstrap: () => Promise<void>;
  register: () => Promise<void>;
  destroy: () => Promise<void>;
  load: () => void;
  routes: Core.Module['routes'];
  config<T = unknown>(key: PropertyPath, defaultVal?: T): T; // TODO: this mirrors ConfigProvider.get, we should use it directly
  contentType: (ctName: UID.ContentType) => Struct.ContentTypeSchema;
  contentTypes: Record<string, Struct.ContentTypeSchema>;
  service: (serviceName: UID.Service) => Core.Service;
  services: Record<string, Core.Service>;
  policy: (policyName: UID.Policy) => Core.Policy;
  policies: Record<string, Core.Policy>;
  middleware: (middlewareName: UID.Middleware) => Core.Middleware;
  middlewares: Record<string, Core.Middleware>;
  controller: (controllerName: UID.Controller) => Core.Controller;
  controllers: Record<string, Core.Controller>;
}

// Removes the namespace from a map with keys prefixed with a namespace
const removeNamespacedKeys = <T extends Record<string, unknown>>(map: T, namespace: string) => {
  return _.mapKeys(map, (value, key) => removeNamespace(key, namespace));
};

const defaultModule = {
  config: {},
  routes: [],
  controllers: {},
  services: {},
  contentTypes: {},
  policies: {},
  middlewares: {},
};

export const createModule = (
  namespace: string,
  rawModule: RawModule,
  leao: Core.Leao
): Module => {
  _.defaults(rawModule, defaultModule);

  try {
    validateModule(rawModule);
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      throw new Error(`leao-server.js is invalid for '${namespace}'.\n${e.errors.join('\n')}`);
    }
  }

  const called: LifecyclesState = {};
  return {
    async bootstrap() {
      if (called.bootstrap) {
        throw new Error(`Bootstrap for ${namespace} has already been called`);
      }
      called.bootstrap = true;
      await (rawModule.bootstrap && rawModule.bootstrap({ leao }));
    },
    async register() {
      if (called.register) {
        throw new Error(`Register for ${namespace} has already been called`);
      }
      called.register = true;
      await (rawModule.register && rawModule.register({ leao }));
    },
    async destroy() {
      if (called.destroy) {
        throw new Error(`Destroy for ${namespace} has already been called`);
      }
      called.destroy = true;
      await (rawModule.destroy && rawModule.destroy({ leao }));
    },
    load() {
      leao.get('content-types').add(namespace, rawModule.contentTypes);
      leao.get('services').add(namespace, rawModule.services);
      leao.get('policies').add(namespace, rawModule.policies);
      leao.get('middlewares').add(namespace, rawModule.middlewares);
      leao.get('controllers').add(namespace, rawModule.controllers);
      leao.get('config').set(namespace, rawModule.config);
    },
    get routes() {
      return rawModule.routes ?? {};
    },
    config(path: PropertyPath, defaultValue: unknown) {
      const pathArray = flatten([namespace, path]);
      return leao.get('config').get(pathArray, defaultValue);
    },
    contentType(ctName: UID.ContentType) {
      return leao.get('content-types').get(`${namespace}.${ctName}`);
    },
    get contentTypes() {
      const contentTypes = leao.get('content-types').getAll(namespace);
      return removeNamespacedKeys(contentTypes, namespace);
    },
    service(serviceName: UID.Service) {
      return leao.get('services').get(`${namespace}.${serviceName}`);
    },
    get services() {
      const services = leao.get('services').getAll(namespace);
      return removeNamespacedKeys(services, namespace);
    },
    policy(policyName: UID.Policy) {
      return leao.get('policies').get(`${namespace}.${policyName}`);
    },
    get policies() {
      const policies = leao.get('policies').getAll(namespace);
      return removeNamespacedKeys(policies, namespace);
    },
    middleware(middlewareName: UID.Middleware) {
      return leao.get('middlewares').get(`${namespace}.${middlewareName}`);
    },
    get middlewares() {
      const middlewares = leao.get('middlewares').getAll(namespace);
      return removeNamespacedKeys(middlewares, namespace);
    },
    controller(controllerName: UID.Controller) {
      return leao.get('controllers').get(`${namespace}.${controllerName}`);
    },
    get controllers() {
      const controllers = leao.get('controllers').getAll(namespace);
      return removeNamespacedKeys(controllers, namespace);
    },
  };
};
