import * as globalAgent from 'global-agent';
import path from 'path';
import _ from 'lodash';
import { isFunction } from 'lodash/fp';
import { Logger, createLogger } from '@leao1/utils';
import { Database } from '@leao1/database';

import type { Core, Modules, UID, Schema } from '@leao1/types';

import { loadConfiguration } from './configuration';

import * as factories from './factories';

import * as utils from './utils';
import { Container } from './container';
import createLeaoFs from './services/fs';
import createEventHub from './services/event-hub';
import { createServer } from './services/server';
import { createReloader } from './services/reloader';

import { providers } from './providers';
import createEntityService from './services/entity-service';
import createQueryParamService from './services/query-params';

import entityValidator from './services/entity-validator';
import requestContext from './services/request-context';
import createAuth from './services/auth';
import createCustomFields from './services/custom-fields';
import createContentAPI from './services/content-api';
import getNumberOfDynamicZones from './services/utils/dynamic-zones';
import { FeaturesService, createFeaturesService } from './services/features';
import { createDocumentService } from './services/document-service';

import { coreStoreModel } from './services/core-store';
import { createConfigProvider } from './services/config';

class Leao extends Container implements Core.Leao {
  app: any;

  isLoaded: boolean = false;

  internal_config: Record<string, unknown> = {};

  constructor(opts: LeaoOptions) {
    super();

    this.internal_config = loadConfiguration(opts);

    this.registerInternalServices();

    for (const provider of providers) {
      provider.init?.(this);
    }
  }

  get admin(): Core.Module {
    return this.get('admin');
  }

  get EE(): boolean {
    return utils.ee.isEE;
  }

  get ee(): Core.Leao['ee'] {
    return utils.ee;
  }

  get dirs(): Core.LeaoDirectories {
    return this.config.get('dirs');
  }

  get reload(): Core.Reloader {
    return this.get('reload');
  }

  get db(): Database {
    return this.get('db');
  }

  get requestContext(): Modules.RequestContext.RequestContext {
    return this.get('requestContext');
  }

  get customFields(): Modules.CustomFields.CustomFields {
    return this.get('customFields');
  }

  get entityValidator(): Modules.EntityValidator.EntityValidator {
    return this.get('entityValidator');
  }

  /**
   * @deprecated `leao.entityService` will be removed in the next major version
   */
  get entityService(): Modules.EntityService.EntityService {
    return this.get('entityService');
  }

  get documents(): Modules.Documents.Service {
    return this.get('documents');
  }

  get features(): FeaturesService {
    return this.get('features');
  }

  get fetch(): Modules.Fetch.Fetch {
    return this.get('fetch');
  }

  get cron(): Modules.Cron.CronService {
    return this.get('cron');
  }

  get log(): Logger {
    return this.get('logger');
  }

  get startupLogger(): Core.StartupLogger {
    return this.get('startupLogger');
  }

  get eventHub(): Modules.EventHub.EventHub {
    return this.get('eventHub');
  }

  get fs(): Core.LeaoFS {
    return this.get('fs');
  }

  get server(): Modules.Server.Server {
    return this.get('server');
  }

  get store(): Modules.CoreStore.CoreStore {
    return this.get('coreStore');
  }

  get config() {
    return this.get('config');
  }

  get services() {
    return this.get('services').getAll();
  }

  service(uid: UID.Service) {
    return this.get('services').get(uid);
  }

  get controllers() {
    return this.get('controllers').getAll();
  }

  controller(uid: UID.Controller) {
    return this.get('controllers').get(uid);
  }

  get contentTypes(): Schema.ContentTypes {
    return this.get('content-types').getAll();
  }

  contentType(name: UID.ContentType) {
    return this.get('content-types').get(name);
  }

  get components(): Schema.Components {
    return this.get('components').getAll();
  }

  get policies() {
    return this.get('policies').getAll();
  }

  policy(name: string) {
    return this.get('policies').get(name);
  }

  get middlewares() {
    return this.get('middlewares').getAll();
  }

  middleware(name: string) {
    return this.get('middlewares').get(name);
  }

  get plugins(): Record<string, Core.Plugin> {
    return this.get('plugins').getAll();
  }

  plugin(name: string): Core.Plugin {
    return this.get('plugins').get(name);
  }

  get hooks() {
    return this.get('hooks').getAll();
  }

  hook(name: string) {
    return this.get('hooks').get(name);
  }

  get apis() {
    return this.get('apis').getAll();
  }

  api(name: string): Core.Module {
    return this.get('apis').get(name);
  }

  get auth() {
    return this.get('auth');
  }

  get contentAPI() {
    return this.get('content-api');
  }

  get sanitizers() {
    return this.get('sanitizers');
  }

  get validators() {
    return this.get('validators');
  }

  async start() {
    try {
      if (!this.isLoaded) {
        await this.load();
      }

      await this.listen();

      return this;
    } catch (error) {
      return this.stopWithError(error);
    }
  }

  // TODO: split into more providers
  registerInternalServices() {
    const config = createConfigProvider(this.internal_config, this);

    const logger = createLogger({
      level: 'http', // Leao defaults to level 'http'
      ...config.get('logger'), // DEPRECATED
      ...config.get('server.logger.config'),
    });

    // Instantiate the Leao container
    this.add('config', () => config)
      .add('query-params', createQueryParamService(this))
      .add('content-api', createContentAPI(this))
      .add('auth', createAuth())
      .add('server', () => createServer(this))
      .add('fs', () => createLeaoFs(this))
      .add('eventHub', () => createEventHub())
      .add('startupLogger', () => utils.createStartupLogger(this))
      .add('logger', () => logger)
      .add('fetch', () => utils.createLeaoFetch(this))
      .add('features', () => createFeaturesService(this))
      .add('requestContext', requestContext)
      .add('customFields', createCustomFields(this))
      .add('entityValidator', entityValidator)
      .add('entityService', () => createEntityService({ leao: this, db: this.db }))
      .add('documents', () => createDocumentService(this))
      .add(
        'db',
        () =>
          new Database(
            _.merge(this.config.get('database'), {
              logger,
              settings: {
                migrations: {
                  dir: path.join(this.dirs.app.root, 'database/migrations'),
                },
              },
            })
          )
      )
      .add('reload', () => createReloader(this));
  }

  async openAdmin({ isInitialized }: { isInitialized: boolean }) {
    const shouldOpenAdmin =
      this.config.get('environment') === 'development' &&
      this.config.get('admin.autoOpen', true) !== false;

    if (shouldOpenAdmin && !isInitialized) {
      try {
        await utils.openBrowser(this.config);
      } catch {
        // Ignore browser open errors
      }
    }
  }

  async postListen() {
    const isInitialized = await utils.isInitialized(this);

    this.startupLogger.logStartupMessage({ isInitialized });

    this.log.info('Leao started successfully');
    this.openAdmin({ isInitialized });
  }

  /**
   * Add behaviors to the server
   */
  async listen() {
    return new Promise<void>((resolve, reject) => {
      const onListen = async () => {
        try {
          await this.postListen();

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      const listenSocket = this.config.get('server.socket');

      if (listenSocket) {
        this.server.listen(listenSocket, onListen);
      } else {
        const { host, port } = this.config.get('server');

        this.server.listen(port, host, onListen);
      }
    });
  }

  stopWithError(err: unknown, customMessage?: string): never {
    this.log.debug(`⛔️ Server wasn't able to start properly.`);
    if (customMessage) {
      this.log.error(customMessage);
    }

    this.log.error(err);
    return this.stop();
  }

  stop(exitCode = 1): never {
    this.destroy();

    if (this.config.get('autoReload')) {
      process.send?.('stop');
    }

    // Kill process
    process.exit(exitCode);
  }

  async load() {
    const trace = (s: string) =>
      process.env.LEAO_TRACE && process.stderr.write(`[leao] ${s}\n`);
    trace('load:start');
    await this.register();
    trace('load:register done');
    await this.bootstrap();
    trace('load:bootstrap done');

    this.isLoaded = true;

    return this;
  }

  async register() {
    const trace = (s: string) =>
      process.env.LEAO_TRACE && process.stderr.write(`[leao] ${s}\n`);
    trace('register:start');
    // @ts-expect-error: init is internal
    this.ee.init(this.dirs.app.root, this.log);

    for (const provider of providers) {
      await provider.register?.(this);
    }
    trace('register:providers done');

    await this.runPluginsLifecycles(utils.LIFECYCLES.REGISTER);
    trace('register:plugins done');
    await this.runUserLifecycles(utils.LIFECYCLES.REGISTER);
    trace('register:user done');

    // NOTE: Swap type customField for underlying data type
    utils.convertCustomFieldType(this);

    return this;
  }

  async bootstrap() {
    const trace = (s: string) =>
      process.env.LEAO_TRACE && process.stderr.write(`[leao] ${s}\n`);
    trace('bootstrap:start');
    this.configureGlobalProxy();

    const models = [
      ...utils.transformContentTypesToModels(
        [...Object.values(this.contentTypes), ...Object.values(this.components)],
        this.db.metadata.identifiers
      ),
      ...this.get('models').get(),
    ];

    trace('bootstrap:db.init');
    await this.db.init({ models });
    trace('bootstrap:db.init done');

    let oldContentTypes;
    if (await this.db.getSchemaConnection().hasTable(coreStoreModel.tableName)) {
      oldContentTypes = await this.store.get({
        type: 'leao',
        name: 'content_types',
        key: 'schema',
      });
    }

    await this.hook('leao::content-types.beforeSync').call({
      oldContentTypes,
      contentTypes: this.contentTypes,
    });

    trace('bootstrap:schema.sync');
    await this.db.schema.sync();
    trace('bootstrap:schema.sync done');

    await this.hook('leao::content-types.afterSync').call({
      oldContentTypes,
      contentTypes: this.contentTypes,
    });

    await this.store.set({
      type: 'leao',
      name: 'content_types',
      key: 'schema',
      value: this.contentTypes,
    });

    trace('bootstrap:initMiddlewares');
    await this.server.initMiddlewares();
    this.server.initRouting();
    trace('bootstrap:initRouting done');

    await this.contentAPI.permissions.registerActions();
    trace('bootstrap:permissions done');

    trace('bootstrap:plugins');
    await this.runPluginsLifecycles(utils.LIFECYCLES.BOOTSTRAP);
    trace('bootstrap:plugins done');

    for (const provider of providers) {
      await provider.bootstrap?.(this);
    }
    trace('bootstrap:providers done');

    await this.runUserLifecycles(utils.LIFECYCLES.BOOTSTRAP);
    trace('bootstrap:user done');

    return this;
  }

  configureGlobalProxy() {
    const globalProxy = this.config.get('server.proxy.global');
    const httpProxy = this.config.get('server.proxy.http') || globalProxy;
    const httpsProxy = this.config.get('server.proxy.https') || globalProxy;

    if (!httpProxy && !httpsProxy) {
      return;
    }

    globalAgent.bootstrap();

    if (httpProxy) {
      this.log.info(`Using HTTP proxy: ${httpProxy}`);
      (global as any).GLOBAL_AGENT.HTTP_PROXY = httpProxy;
    }

    if (httpsProxy) {
      this.log.info(`Using HTTPS proxy: ${httpsProxy}`);
      (global as any).GLOBAL_AGENT.HTTPS_PROXY = httpsProxy;
    }
  }

  async destroy() {
    this.log.info('Shutting down Leao');
    await this.runPluginsLifecycles(utils.LIFECYCLES.DESTROY);

    for (const provider of providers) {
      await provider.destroy?.(this);
    }

    await this.runUserLifecycles(utils.LIFECYCLES.DESTROY);

    await this.server.destroy();

    this.eventHub.destroy();

    await this.db?.destroy();

    process.removeAllListeners();

    // @ts-expect-error: Allow clean delete of global.leao to allow re-instanciation
    delete global.leao;

    this.log.info('Leao has been shut down');
  }

  async runPluginsLifecycles(lifecycleName: 'register' | 'bootstrap' | 'destroy') {
    // plugins
    await this.get('modules')[lifecycleName]();
  }

  async runUserLifecycles(lifecycleName: 'register' | 'bootstrap' | 'destroy') {
    // user
    const userLifecycleFunction = this.app && this.app[lifecycleName];
    if (isFunction(userLifecycleFunction)) {
      await userLifecycleFunction({ leao: this });
    }
  }

  getModel(uid: UID.ContentType): Schema.ContentType;
  getModel(uid: UID.Component): Schema.Component;
  getModel<TUID extends UID.Schema>(uid: TUID): Schema.ContentType | Schema.Component | undefined {
    if (uid in this.contentTypes) {
      return this.contentTypes[uid as UID.ContentType];
    }

    if (uid in this.components) {
      return this.components[uid as UID.Component];
    }
  }

  /**
   * @deprecated Use `leao.db.query` instead
   */
  query(uid: UID.Schema) {
    return this.db.query(uid);
  }
}

export interface LeaoOptions {
  appDir: string;
  distDir: string;
  autoReload?: boolean;
  serveAdminPanel?: boolean;
}

export default Leao;
